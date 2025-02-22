"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Link from "next/link"

// Reduce grid size for more compact display
const GRID_SIZE = { rows: 4, cols: 4 } // Increased from 3x3 to 4x4
const TRAINING_OBJECTS = [
    {
        name: "cube",
        geometry: new THREE.BoxGeometry(0.3, 0.3, 0.3),
        material: new THREE.MeshStandardMaterial({
            color: 0x2196f3,
            metalness: 0.5,
            roughness: 0.5,
        }),
    },
    {
        name: "sphere",
        geometry: new THREE.SphereGeometry(0.2, 32, 32),
        material: new THREE.MeshStandardMaterial({
            color: 0x4caf50,
            metalness: 0.5,
            roughness: 0.5,
        }),
    },
    {
        name: "cylinder",
        geometry: new THREE.CylinderGeometry(0.15, 0.15, 0.4, 32),
        material: new THREE.MeshStandardMaterial({
            color: 0xff9800,
            metalness: 0.5,
            roughness: 0.5,
        }),
    },
]

const PICK_PHASES = {
    SEARCH: 0,    // Looking for object
    APPROACH: 1,  // Moving towards object
    GRASP: 2,     // Attempting to grasp
    LIFT: 3,      // Lifting object
    PLACE: 4      // Placing object back
}

const LEARNING_TASKS = [
    {
        name: "Basic Pick and Place",
        color: 0x4285f4,
        duration: 5000,
        behavior: {
            baseRotation: (t: number, i: number, phase: number) => {
                // Base rotation is now handled by IK
                return 0
            },
            shoulderRange: { min: -Math.PI / 2, max: Math.PI / 2 },
            elbowRange: { min: 0, max: Math.PI },
            getJointAngles: (targetPos: THREE.Vector3, phase: number, learningProgress: number) => {
                // Apply learning inaccuracy that decreases over time
                const learningError = (1 - learningProgress) * 0.3
                const adjustedTarget = targetPos.clone()
                adjustedTarget.x += Math.sin(Date.now() * 0.002) * learningError
                adjustedTarget.z += Math.cos(Date.now() * 0.002) * learningError

                // Calculate IK
                const angles = calculateIK(adjustedTarget, phase)

                return {
                    shoulder: angles.shoulder,
                    elbow: angles.elbow,
                    wrist: angles.wrist
                }
            },
            gripperAction: (t: number, phase: number) => {
                switch (phase) {
                    case PICK_PHASES.SEARCH:
                        return 0.5
                    case PICK_PHASES.APPROACH:
                        return 0.4
                    case PICK_PHASES.GRASP:
                        return 0.1
                    case PICK_PHASES.LIFT:
                        return 0.15
                    case PICK_PHASES.PLACE:
                        return 0.4
                    default:
                        return 0.3
                }
            }
        }
    },
    {
        name: "Path Planning",
        color: 0x34a853,
        duration: 4000,
        behavior: {
            baseRotation: (t: number, i: number, phase: number) => {
                const primary = Math.sin(t * 0.4) * Math.PI * 0.8
                const secondary = Math.cos(t * 0.2 + i) * 0.3
                return primary + secondary
            },
            shoulderRange: { min: -0.5, max: 0.5 },
            elbowRange: { min: -0.7, max: 0.3 },
            getJointAngles: (targetPos: THREE.Vector3, phase: number, learningProgress: number) => {
                const distance = targetPos.length()
                const height = targetPos.y
                const reach = Math.min(distance, 2.5) / 2.5
                const pathPhase = Math.sin(learningProgress * Math.PI * 2)

                return {
                    shoulder: -0.3 + Math.cos(phase * Math.PI * 2) * 0.4,
                    elbow: -0.4 + Math.sin(phase * Math.PI * 2) * 0.3,
                    wrist: Math.cos(phase * Math.PI) * 0.5
                }
            },
            gripperAction: (t: number, phase: number) => 0.3 + Math.sin(t) * 0.2
        }
    },
    {
        name: "Object Recognition",
        color: 0xfbbc05,
        duration: 2500,
        behavior: {
            baseRotation: (t: number, i: number, phase: number) => {
                const scan = Math.cos(t * 0.2) * Math.PI * 0.6
                const micro = Math.sin(t * 3 + i) * 0.1
                return scan + micro
            },
            shoulderRange: { min: -0.4, max: 0.6 },
            elbowRange: { min: -0.5, max: 0.4 },
            getJointAngles: (targetPos: THREE.Vector3, phase: number, learningProgress: number) => {
                const scanPhase = Math.sin(learningProgress * Math.PI * 2)

                return {
                    shoulder: -0.2 + scanPhase * 0.3,
                    elbow: -0.3 + Math.cos(scanPhase * Math.PI) * 0.4,
                    wrist: Math.sin(phase * Math.PI) * 0.7 + Math.cos(phase * 2) * 0.3
                }
            },
            gripperAction: (t: number, phase: number) => 0.2 + Math.abs(Math.sin(t * 2)) * 0.3
        }
    },
    {
        name: "Precision Control",
        color: 0xea4335,
        duration: 3500,
        behavior: {
            baseRotation: (t: number, i: number, phase: number) => {
                const main = Math.sin(t * 0.15) * Math.PI * 0.3
                const fine = Math.sin(t * 4 + i) * 0.05
                return main + fine
            },
            shoulderRange: { min: -0.3, max: 0.3 },
            elbowRange: { min: -0.4, max: 0.4 },
            getJointAngles: (targetPos: THREE.Vector3, phase: number, learningProgress: number) => {
                const precisionPhase = Math.sin(learningProgress * Math.PI * 4)

                return {
                    shoulder: -0.1 + precisionPhase * 0.2,
                    elbow: -0.2 + Math.cos(precisionPhase * Math.PI) * 0.3,
                    wrist: Math.cos(phase * Math.PI) * 0.4 + Math.sin(phase * 3) * 0.1
                }
            },
            gripperAction: (t: number, phase: number) => 0.1 + Math.abs(Math.sin(t * 3)) * 0.2
        }
    }
]

// Define robot arm segment lengths (in world units)
const ARM_SEGMENTS = {
    BASE_HEIGHT: 0.3,
    SHOULDER_LENGTH: 1.2,
    ELBOW_LENGTH: 0.8,
    WRIST_LENGTH: 0.4,
    GRIPPER_LENGTH: 0.2
}

// Add floor constants
const FLOOR = {
    HEIGHT: 0.0,  // Floor is at y=0
    MIN_HEIGHT: 0.15, // Minimum height for objects above floor
    SAFE_LIFT_HEIGHT: 1.0, // Safe height for lifting objects
}

// Add joint constraints
const JOINT_CONSTRAINTS = {
    SHOULDER: {
        MIN: -Math.PI / 2,  // Prevent arm from going too far back
        MAX: Math.PI / 2    // Prevent arm from going too far forward
    },
    ELBOW: {
        MIN: -Math.PI / 8,  // Slight upward bend allowed
        MAX: Math.PI * 0.8  // Prevent full fold
    },
    WRIST: {
        MIN: -Math.PI / 2,
        MAX: Math.PI / 2
    }
}

// Modify solveIK function to respect floor and joint constraints
const solveIK = (targetPos: THREE.Vector3, recursionCount: number = 0): {
    baseAngle: number,
    shoulderAngle: number,
    elbowAngle: number,
    wristAngle: number
} => {
    // Prevent infinite recursion
    if (recursionCount > 3) {
        // Return a safe default position if we can't find a valid solution
        return {
            baseAngle: 0,
            shoulderAngle: Math.PI / 4, // 45 degrees up
            elbowAngle: Math.PI / 4,    // 45 degrees
            wristAngle: 0
        }
    }

    // Convert target to local coordinates
    const localTarget = targetPos.clone()

    // Calculate base rotation (around Y axis)
    const baseAngle = Math.atan2(localTarget.x, localTarget.z)

    // Get target in YZ plane
    const targetDist = Math.sqrt(localTarget.x * localTarget.x + localTarget.z * localTarget.z)
    const targetHeight = localTarget.y - ARM_SEGMENTS.BASE_HEIGHT

    // Use law of cosines to solve for shoulder and elbow angles
    const L1 = ARM_SEGMENTS.SHOULDER_LENGTH
    const L2 = ARM_SEGMENTS.ELBOW_LENGTH
    const targetLength = Math.sqrt(targetDist * targetDist + targetHeight * targetHeight)

    // Clamp target length to prevent impossible positions
    const clampedLength = Math.min(L1 + L2 - 0.1, Math.max(Math.abs(L1 - L2) + 0.1, targetLength))

    // Calculate elbow angle using law of cosines
    const cosElbow = (L1 * L1 + L2 * L2 - clampedLength * clampedLength) / (2 * L1 * L2)
    const rawElbowAngle = Math.PI - Math.acos(Math.min(Math.max(-1, cosElbow), 1))

    // Clamp elbow angle to constraints
    const elbowAngle = Math.min(Math.max(rawElbowAngle, JOINT_CONSTRAINTS.ELBOW.MIN), JOINT_CONSTRAINTS.ELBOW.MAX)

    // Calculate shoulder angle
    const targetAngle = Math.atan2(targetHeight, targetDist)
    const cosInner = (L1 * L1 + clampedLength * clampedLength - L2 * L2) / (2 * L1 * clampedLength)
    const innerAngle = Math.acos(Math.min(Math.max(-1, cosInner), 1))
    const rawShoulderAngle = targetAngle + innerAngle

    // Clamp shoulder angle to constraints
    const shoulderAngle = Math.min(Math.max(rawShoulderAngle, JOINT_CONSTRAINTS.SHOULDER.MIN), JOINT_CONSTRAINTS.SHOULDER.MAX)

    // Calculate wrist angle to keep end effector level and prevent floor penetration
    const rawWristAngle = -shoulderAngle - (Math.PI - elbowAngle) + Math.PI / 2
    const wristAngle = Math.min(Math.max(rawWristAngle, JOINT_CONSTRAINTS.WRIST.MIN), JOINT_CONSTRAINTS.WRIST.MAX)

    // Check if any part of the arm would go below floor
    const shoulderPos = new THREE.Vector3(0, ARM_SEGMENTS.BASE_HEIGHT, 0)
    const elbowPos = new THREE.Vector3(
        Math.sin(shoulderAngle) * ARM_SEGMENTS.SHOULDER_LENGTH,
        ARM_SEGMENTS.BASE_HEIGHT + Math.cos(shoulderAngle) * ARM_SEGMENTS.SHOULDER_LENGTH,
        0
    )
    const wristPos = new THREE.Vector3(
        elbowPos.x + Math.sin(shoulderAngle + elbowAngle) * ARM_SEGMENTS.ELBOW_LENGTH,
        elbowPos.y + Math.cos(shoulderAngle + elbowAngle) * ARM_SEGMENTS.ELBOW_LENGTH,
        0
    )

    // If any joint would go below floor, try to adjust the target position
    if (shoulderPos.y < FLOOR.HEIGHT || elbowPos.y < FLOOR.HEIGHT || wristPos.y < FLOOR.HEIGHT) {
        const adjustedTarget = new THREE.Vector3(
            targetPos.x,
            Math.max(targetPos.y, FLOOR.MIN_HEIGHT + ARM_SEGMENTS.SHOULDER_LENGTH * 0.2),
            targetPos.z
        )
        return solveIK(adjustedTarget, recursionCount + 1)
    }

    return {
        baseAngle,
        shoulderAngle,
        elbowAngle,
        wristAngle
    }
}

// Add task cycle states
const TASK_STATES = {
    MOVE_TO_OBJECT: 0,  // Moving to pick up object
    GRASP_OBJECT: 1,    // Closing gripper on object
    LIFT_OBJECT: 2,     // Lifting object up
    MOVE_TO_PLACE: 3,   // Moving to place position
    PLACE_OBJECT: 4,    // Placing object down
    RELEASE_OBJECT: 5,  // Opening gripper
    RESET_POSITION: 6   // Moving back to start position
}

// Add place position generation with better planning
const generatePlacePosition = (robotPos: THREE.Vector3, radius: number = 1.5): THREE.Vector3 => {
    // Generate a position in front of the robot, within a 90-degree arc
    const baseAngle = Math.atan2(robotPos.x, robotPos.z)  // Get robot's orientation
    const placeAngle = baseAngle + (Math.random() - 0.5) * Math.PI / 2  // +/- 45 degrees
    const placeRadius = radius * (0.7 + Math.random() * 0.3)  // 70-100% of max radius

    return new THREE.Vector3(
        robotPos.x + Math.cos(placeAngle) * placeRadius,
        FLOOR.MIN_HEIGHT + 0.05, // Slightly above floor
        robotPos.z + Math.sin(placeAngle) * placeRadius
    )
}

const resetRobotState = (robotArm: THREE.Group, targetPos: THREE.Vector3) => {
    const userData = robotArm.userData
    userData.taskState = TASK_STATES.MOVE_TO_OBJECT
    userData.placePosition = generatePlacePosition(robotArm.position)
    userData.stateStartTime = Date.now()

    // Ensure we store and reset to the initial position
    if (!userData.initialObjectPosition) {
        userData.initialObjectPosition = new THREE.Vector3(
            targetPos.x,
            Math.max(targetPos.y, FLOOR.MIN_HEIGHT), // Ensure object is above floor
            targetPos.z
        )
    }

    if (userData.trainingObject) {
        userData.trainingObject.position.copy(userData.initialObjectPosition)
    }
}

const updateRobotArm = (robotArm: THREE.Group, targetPos: THREE.Vector3, deltaTime: number) => {
    const userData = robotArm.userData
    const joints = userData.joints

    // Initialize task state if not exists
    if (userData.taskState === undefined) {
        userData.cycleCount = 0
        resetRobotState(robotArm, targetPos)
    }

    // Get current target based on task state
    let currentTarget = targetPos.clone()
    let targetGripperWidth = 0.4
    let heightOffset = 0
    let movementSpeed = 5 // Base movement speed

    // Get gripper position
    const gripperPos = new THREE.Vector3()
    joints.gripperLeft.getWorldPosition(gripperPos)

    // Check distance to target
    const distanceToTarget = gripperPos.distanceTo(currentTarget)
    const isNearObject = distanceToTarget < 0.4
    const shouldGrip = userData.taskState === TASK_STATES.LIFT_OBJECT ||
        userData.taskState === TASK_STATES.MOVE_TO_PLACE ||
        userData.taskState === TASK_STATES.GRASP_OBJECT

    // Time spent in current state
    const timeInState = Date.now() - userData.stateStartTime
    const STATE_TIMEOUT = 5000 // 5 seconds timeout for any state

    // Check for stuck states and reset if necessary
    if (timeInState > STATE_TIMEOUT) {
        resetRobotState(robotArm, targetPos)
        return false
    }

    switch (userData.taskState) {
        case TASK_STATES.MOVE_TO_OBJECT:
            currentTarget = userData.initialObjectPosition.clone()
            // Add small height offset to prevent floor collision
            currentTarget.y = Math.max(currentTarget.y, FLOOR.MIN_HEIGHT + 0.1)
            targetGripperWidth = 0.4
            if (isNearObject) {
                userData.taskState = TASK_STATES.GRASP_OBJECT
                userData.stateStartTime = Date.now()
            }
            break

        case TASK_STATES.GRASP_OBJECT:
            currentTarget = userData.initialObjectPosition.clone()
            currentTarget.y = Math.max(currentTarget.y, FLOOR.MIN_HEIGHT)
            targetGripperWidth = 0.1
            if (timeInState > 500) {
                userData.taskState = TASK_STATES.LIFT_OBJECT
                userData.stateStartTime = Date.now()
            }
            break

        case TASK_STATES.LIFT_OBJECT:
            currentTarget = userData.initialObjectPosition.clone()
            heightOffset = FLOOR.SAFE_LIFT_HEIGHT
            targetGripperWidth = 0.1
            if (gripperPos.y > userData.initialObjectPosition.y + 0.8) {
                userData.taskState = TASK_STATES.MOVE_TO_PLACE
                userData.stateStartTime = Date.now()
            }
            break

        case TASK_STATES.MOVE_TO_PLACE:
            currentTarget = userData.placePosition.clone()
            heightOffset = FLOOR.SAFE_LIFT_HEIGHT
            targetGripperWidth = 0.1
            // Slow down as we approach the place position
            if (gripperPos.distanceTo(userData.placePosition) < 1.0) {
                // Reduce speed as we get closer
                movementSpeed *= Math.max(0.3, gripperPos.distanceTo(userData.placePosition) / 1.0)
            }
            if (gripperPos.distanceTo(userData.placePosition) < 0.4) {
                userData.taskState = TASK_STATES.PLACE_OBJECT
                userData.stateStartTime = Date.now()
            }
            break

        case TASK_STATES.PLACE_OBJECT:
            currentTarget = userData.placePosition.clone()
            // More controlled descent
            const descentProgress = Math.min(1, timeInState / 1000) // 1 second descent
            heightOffset = FLOOR.SAFE_LIFT_HEIGHT * (1 - descentProgress) + (FLOOR.MIN_HEIGHT + 0.1) * descentProgress
            targetGripperWidth = 0.1

            // Only transition when we're close to the target height and position
            const atTargetHeight = Math.abs(gripperPos.y - (FLOOR.MIN_HEIGHT + 0.3)) < 0.1
            const atTargetPosition = gripperPos.distanceTo(new THREE.Vector3(
                userData.placePosition.x,
                gripperPos.y,
                userData.placePosition.z
            )) < 0.2

            if (atTargetHeight && atTargetPosition) {
                userData.taskState = TASK_STATES.RELEASE_OBJECT
                userData.stateStartTime = Date.now()
            }
            break

        case TASK_STATES.RELEASE_OBJECT:
            currentTarget = userData.placePosition.clone()
            heightOffset = FLOOR.MIN_HEIGHT + 0.1  // Hold position while releasing
            targetGripperWidth = 0.4
            if (timeInState > 500) {  // Wait for gripper to open
                userData.taskState = TASK_STATES.RESET_POSITION
                userData.stateStartTime = Date.now()
            }
            break

        case TASK_STATES.RESET_POSITION:
            currentTarget = new THREE.Vector3(
                robotArm.position.x,
                FLOOR.SAFE_LIFT_HEIGHT,
                robotArm.position.z + 1
            )
            targetGripperWidth = 0.4
            if (timeInState > 500) {
                userData.cycleCount++
                resetRobotState(robotArm, targetPos)
            }
            break
    }

    // Add height offset to target
    currentTarget.y += heightOffset

    // Ensure we never go below floor
    currentTarget.y = Math.max(currentTarget.y, FLOOR.MIN_HEIGHT)

    // Add minimum height check for all movements
    const safeTarget = currentTarget.clone()
    safeTarget.y = Math.max(
        safeTarget.y,
        FLOOR.MIN_HEIGHT + ARM_SEGMENTS.GRIPPER_LENGTH + 0.1 // Add safety margin
    )

    // Get target in robot's local space
    const localTarget = safeTarget.clone().sub(robotArm.position)

    // Solve IK with floor awareness (start with recursion count 0)
    const solution = solveIK(localTarget, 0)

    // Calculate lerp factor with movement speed
    const lerpFactor = deltaTime * movementSpeed

    // Apply rotations
    joints.base.rotation.y += (solution.baseAngle - joints.base.rotation.y) * lerpFactor
    joints.shoulderJoint.rotation.x += (solution.shoulderAngle - joints.shoulderJoint.rotation.x) * lerpFactor
    joints.elbowJoint.rotation.x += (solution.elbowAngle - joints.elbowJoint.rotation.x) * lerpFactor
    joints.wristJoint.rotation.x += (solution.wristAngle - joints.wristJoint.rotation.x) * lerpFactor

    // Update gripper with faster response
    userData.gripperRotation.current += (targetGripperWidth - userData.gripperRotation.current) * (lerpFactor * 2)
    joints.gripperLeft.rotation.z = userData.gripperRotation.current
    joints.gripperRight.rotation.z = -userData.gripperRotation.current

    return shouldGrip
}

// Update the calculateIK function to be more precise
const calculateIK = (targetPos: THREE.Vector3, phase: number) => {
    // Robot arm dimensions (in local space)
    const L1 = 1.2  // Upper arm length
    const L2 = 0.8  // Forearm length
    const SHOULDER_HEIGHT = 0.3 // Height of shoulder joint from base

    // Calculate horizontal distance and base rotation
    const horizontalDist = Math.sqrt(targetPos.x * targetPos.x + targetPos.z * targetPos.z)
    const targetAngleBase = Math.atan2(targetPos.x, targetPos.z)

    // Calculate vertical distance from shoulder
    const targetHeight = targetPos.y - SHOULDER_HEIGHT

    // Calculate direct distance from shoulder to target
    const targetDist = Math.sqrt(horizontalDist * horizontalDist + targetHeight * targetHeight)

    // Clamp target distance to prevent impossible positions
    const clampedDist = Math.min(Math.max(0.3, targetDist), L1 + L2 - 0.1)

    // Calculate elbow angle using law of cosines
    const cosElbow = (L1 * L1 + L2 * L2 - clampedDist * clampedDist) / (2 * L1 * L2)
    const elbowAngle = Math.PI - Math.acos(Math.min(Math.max(-1, cosElbow), 1))

    // Calculate shoulder angle
    const targetAngle = Math.atan2(targetHeight, horizontalDist)
    const cosInner = (L1 * L1 + clampedDist * clampedDist - L2 * L2) / (2 * L1 * clampedDist)
    const innerAngle = Math.acos(Math.min(Math.max(-1, cosInner), 1))
    const shoulderAngle = targetAngle + innerAngle

    // Calculate wrist angle to keep end effector level
    const wristAngle = -shoulderAngle - (Math.PI - elbowAngle) + Math.PI / 2

    // Phase-specific adjustments
    let shoulderMod = 0
    let elbowMod = 0
    let wristMod = 0

    switch (phase) {
        case PICK_PHASES.SEARCH:
            // Small searching movements
            shoulderMod = Math.sin(Date.now() * 0.001) * 0.1
            wristMod = Math.cos(Date.now() * 0.001) * 0.1
            break
        case PICK_PHASES.APPROACH:
            // Precise approach adjustments
            shoulderMod = Math.sin(Date.now() * 0.002) * 0.05
            elbowMod = -Math.sin(Date.now() * 0.002) * 0.05
            break
        case PICK_PHASES.GRASP:
            // Minimal movement during grasp
            shoulderMod = Math.sin(Date.now() * 0.003) * 0.02
            break
        case PICK_PHASES.LIFT:
            // Lifting motion
            shoulderMod = -0.2
            elbowMod = -0.1
            break
        case PICK_PHASES.PLACE:
            // Placing motion
            shoulderMod = 0.1
            elbowMod = 0.1
            break
    }

    return {
        base: targetAngleBase,
        shoulder: shoulderAngle + shoulderMod,
        elbow: elbowAngle + elbowMod,
        wrist: wristAngle + wristMod
    }
}

export default function TrainingRobotics() {
    const mountRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const sceneRef = useRef<THREE.Scene>()
    const cameraRef = useRef<THREE.PerspectiveCamera>()
    const robotArmsRef = useRef<THREE.Group[]>([])
    const animationFrameRef = useRef<number>()
    const mousePosition = useRef(new THREE.Vector3())
    const raycaster = useRef(new THREE.Raycaster())
    const mouseOver = useRef<number | null>(null)

    const createRobotArm = useCallback((task: typeof LEARNING_TASKS[0]) => {
        // Enhanced materials with industrial robot look
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.8,
            roughness: 0.2,
        })
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0xffa500, // Industrial orange
            metalness: 0.6,
            roughness: 0.3,
        })
        const jointMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            metalness: 0.9,
            roughness: 0.1,
        })

        // Create proper joint hierarchy
        const armGroup = new THREE.Group()

        // Base
        const baseGeometry = new THREE.CylinderGeometry(0.5, 0.6, 0.2, 32)
        const base = new THREE.Mesh(baseGeometry, baseMaterial)
        armGroup.add(base)

        // Shoulder joint (rotates around Y axis)
        const shoulderJoint = new THREE.Group()
        shoulderJoint.position.y = 0.3
        base.add(shoulderJoint)

        // Shoulder
        const shoulderGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
        const shoulder = new THREE.Mesh(shoulderGeometry, jointMaterial)
        shoulderJoint.add(shoulder)

        // Upper arm group (controlled by shoulder)
        const upperArmGroup = new THREE.Group()
        upperArmGroup.position.y = 0.2
        shoulder.add(upperArmGroup)

        // Upper arm
        const upperArmGeometry = new THREE.BoxGeometry(0.2, 1.2, 0.2)
        const upperArm = new THREE.Mesh(upperArmGeometry, armMaterial)
        upperArm.position.y = 0.6
        upperArmGroup.add(upperArm)

        // Elbow joint (rotates around Z axis)
        const elbowJoint = new THREE.Group()
        elbowJoint.position.y = 1.2
        upperArmGroup.add(elbowJoint)

        // Elbow
        const elbowGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)
        const elbow = new THREE.Mesh(elbowGeometry, jointMaterial)
        elbowJoint.add(elbow)

        // Forearm group (controlled by elbow)
        const forearmGroup = new THREE.Group()
        forearmGroup.position.y = 0.15
        elbow.add(forearmGroup)

        // Forearm
        const forearmGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15)
        const forearm = new THREE.Mesh(forearmGeometry, armMaterial)
        forearm.position.y = 0.4
        forearmGroup.add(forearm)

        // Wrist joint (allows full rotation)
        const wristJoint = new THREE.Group()
        wristJoint.position.y = 0.8
        forearmGroup.add(wristJoint)

        // Wrist
        const wristGeometry = new THREE.BoxGeometry(0.25, 0.25, 0.25)
        const wrist = new THREE.Mesh(wristGeometry, jointMaterial)
        wristJoint.add(wrist)

        // Gripper mount
        const gripperMount = new THREE.Group()
        gripperMount.position.y = 0.2
        wrist.add(gripperMount)

        // Gripper
        const gripperBaseGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.2)
        const gripperBase = new THREE.Mesh(gripperBaseGeometry, jointMaterial)
        gripperMount.add(gripperBase)

        // Gripper prongs
        const prongGeometry = new THREE.BoxGeometry(0.05, 0.2, 0.05)
        const leftProng = new THREE.Mesh(prongGeometry, armMaterial)
        leftProng.position.set(-0.1, 0.1, 0)
        const rightProng = new THREE.Mesh(prongGeometry, armMaterial)
        rightProng.position.set(0.1, 0.1, 0)
        gripperBase.add(leftProng, rightProng)

        // Store references to joints in userData for animation
        armGroup.userData = {
            task,
            joints: {
                base: base,
                shoulderJoint: shoulderJoint,
                elbowJoint: elbowJoint,
                wristJoint: wristJoint,
                gripperLeft: leftProng,
                gripperRight: rightProng
            },
            shoulderRotation: { current: 0, target: 0 },
            elbowRotation: { current: 0, target: 0 },
            wristRotation: { current: 0, target: 0 },
            gripperRotation: { current: 0, target: 0 },
            lastUpdateTime: Date.now(),
            learningProgress: 0,
        }

        return armGroup
    }, [])

    // Update mouse tracking handler to use cameraRef
    const handleMouseMove = useCallback((event: MouseEvent) => {
        const rect = mountRef.current?.getBoundingClientRect()
        if (!rect || !cameraRef.current) return

        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

        raycaster.current.setFromCamera(new THREE.Vector2(x, y), cameraRef.current)

        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1))
        raycaster.current.ray.intersectPlane(planeZ, mousePosition.current)
    }, [])

    useEffect(() => {
        if (!mountRef.current) return

        // Scene setup
        const scene = new THREE.Scene()
        sceneRef.current = scene
        scene.background = new THREE.Color(0xffffff)

        // Adjust camera for closer view
        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set(0, 10, 14) // Adjusted for better overview
        cameraRef.current = camera

        // Renderer setup with parent size
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })
        const parentWidth = mountRef.current.clientWidth
        const parentHeight = mountRef.current.clientHeight
        renderer.setSize(parentWidth, parentHeight)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap // Softer shadows
        renderer.outputColorSpace = THREE.SRGBColorSpace // Better color reproduction
        mountRef.current.appendChild(renderer.domElement)

        // Enhanced lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7) // Brighter ambient light
        scene.add(ambientLight)

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.0) // Brighter main light
        mainLight.position.set(5, 8, 5)
        mainLight.castShadow = true
        mainLight.shadow.mapSize.width = 1024
        mainLight.shadow.mapSize.height = 1024
        mainLight.shadow.camera.near = 0.1
        mainLight.shadow.camera.far = 30
        mainLight.shadow.bias = -0.001
        scene.add(mainLight)

        // Add rim light for better depth
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.4)
        rimLight.position.set(-5, 5, -5)
        scene.add(rimLight)

        // Add subtle fill light
        const fillLight = new THREE.DirectionalLight(0x4285f4, 0.3)
        fillLight.position.set(0, 5, -10)
        scene.add(fillLight)

        // Reduced spacing between robots
        const spacing = 2.5 // Further reduced spacing for more compact layout
        const offsetX = ((GRID_SIZE.cols - 1) * spacing) / 2
        const offsetZ = ((GRID_SIZE.rows - 1) * spacing) / 2

        // Create robot grid
        for (let row = 0; row < GRID_SIZE.rows; row++) {
            for (let col = 0; col < GRID_SIZE.cols; col++) {
                const taskIndex = (row * GRID_SIZE.cols + col) % LEARNING_TASKS.length
                const robotArm = createRobotArm(LEARNING_TASKS[taskIndex])
                robotArm.position.set(col * spacing - offsetX, 0, row * spacing - offsetZ)

                // Add subtle random rotation for more natural look
                robotArm.rotation.y = (Math.random() - 0.5) * 0.2

                scene.add(robotArm)
                robotArmsRef.current.push(robotArm)

                const objectType = TRAINING_OBJECTS[Math.floor(Math.random() * TRAINING_OBJECTS.length)]
                const objectPosition = new THREE.Vector3(
                    col * spacing - offsetX + (Math.random() - 0.5) * 0.8,
                    0.15,
                    row * spacing - offsetZ + (Math.random() - 0.5) * 0.8
                )
                const trainingObject = createTrainingObject(objectType, objectPosition)
                scene.add(trainingObject)
                robotArm.userData.trainingObject = trainingObject
            }
        }

        // Enhanced platform with subtle gradient
        const platformGeometry = new THREE.PlaneGeometry(
            GRID_SIZE.cols * spacing + 3,
            GRID_SIZE.rows * spacing + 3
        )
        const platformMaterial = new THREE.MeshPhongMaterial({
            color: 0xf8f9fa,
            side: THREE.DoubleSide,
            shininess: 30
        })
        const platform = new THREE.Mesh(platformGeometry, platformMaterial)
        platform.rotation.x = Math.PI / 2
        platform.position.y = -0.1
        platform.receiveShadow = true
        scene.add(platform)

        // Refined grid
        const gridHelper = new THREE.GridHelper(
            Math.max(GRID_SIZE.rows, GRID_SIZE.cols) * spacing + 2,
            12,
            0xe9ecef, // Subtle grid color
            0xf8f9fa
        )
        gridHelper.position.y = -0.09
        scene.add(gridHelper)

        // Adjusted controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = true
        controls.enablePan = true
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.rotateSpeed = 0.5
        controls.maxPolarAngle = Math.PI / 2.2
        controls.minPolarAngle = Math.PI / 6
        controls.maxDistance = 25 // Adjusted for new grid size
        controls.minDistance = 5
        controls.target.set(0, 1, 0)

        // Animation loop
        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate)
            controls.update()

            const currentTime = Date.now()
            const time = currentTime * 0.001

            robotArmsRef.current.forEach((robotArm, index) => {
                const userData = robotArm.userData
                const trainingObject = userData.trainingObject as THREE.Mesh
                const timeDelta = (currentTime - userData.lastUpdateTime) / 1000

                userData.learningProgress = (time % (userData.task.duration / 1000)) / (userData.task.duration / 1000)

                if (!trainingObject.position ||
                    isNaN(trainingObject.position.x) ||
                    isNaN(trainingObject.position.y) ||
                    isNaN(trainingObject.position.z)) {
                    trainingObject.position.copy(userData.initialObjectPosition || new THREE.Vector3(
                        robotArm.position.x + (Math.random() - 0.5) * 2,
                        0.15,
                        robotArm.position.z + (Math.random() - 0.5) * 2
                    ))
                }

                const targetPos = trainingObject.position.clone()
                const shouldGrip = updateRobotArm(robotArm, targetPos, timeDelta)

                if (shouldGrip) {
                    const endEffectorPos = new THREE.Vector3()
                    userData.joints.gripperLeft.getWorldPosition(endEffectorPos)
                    endEffectorPos.y -= ARM_SEGMENTS.GRIPPER_LENGTH
                    endEffectorPos.y = Math.max(endEffectorPos.y, FLOOR.MIN_HEIGHT)
                    trainingObject.position.copy(endEffectorPos)
                } else if (userData.taskState === TASK_STATES.RELEASE_OBJECT ||
                    userData.taskState === TASK_STATES.RESET_POSITION) {
                    if (trainingObject.position.y > FLOOR.MIN_HEIGHT) {
                        trainingObject.position.y = Math.max(FLOOR.MIN_HEIGHT, trainingObject.position.y - 20 * timeDelta)
                    }
                }

                userData.lastUpdateTime = currentTime
            })

            renderer.render(scene, camera)
        }

        animate()
        setIsLoading(false)

        const handleResize = () => {
            const parentWidth = mountRef.current?.clientWidth || window.innerWidth
            const parentHeight = mountRef.current?.clientHeight || window.innerHeight
            camera.aspect = parentWidth / parentHeight
            camera.updateProjectionMatrix()
            renderer.setSize(parentWidth, parentHeight)
        }

        window.addEventListener("resize", handleResize)
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener("resize", handleResize)
            window.removeEventListener('mousemove', handleMouseMove)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            if (mountRef.current?.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement)
            }
            controls.dispose()
        }
    }, [createRobotArm, handleMouseMove])

    return (
        <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-white to-gray-50"> {/* Added subtle gradient background */}
            <div ref={mountRef} className="absolute inset-0" />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
        </div>
    )
}

const createTrainingObject = (type: typeof TRAINING_OBJECTS[0], position: THREE.Vector3) => {
    const object = new THREE.Mesh(type.geometry, type.material)
    object.position.copy(position)
    object.castShadow = true
    object.receiveShadow = true

    // Add subtle floating animation
    const startY = position.y
    object.userData = {
        startY,
        animate: (time: number) => {
            object.position.y = startY + Math.sin(time * 2) * 0.05
            object.rotation.y = time * 0.5
        }
    }

    return object
}

