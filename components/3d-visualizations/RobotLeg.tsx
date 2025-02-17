import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GroupProps, ThreeElements, useThree } from "@react-three/fiber";

// Constants for the humanoid leg dimensions
export const LEG_DIMENSIONS = {
    UPPER_LENGTH: 0.4, // Thigh length
    LOWER_LENGTH: 0.45, // Shin length
    HIP_WIDTH: 0.08,
    KNEE_WIDTH: 0.07,
    ANKLE_WIDTH: 0.06,
    WIDTH: 0.08,
    JOINT_RADIUS: 0.05,
    FOOT: {
        LENGTH: 0.2,
        WIDTH: 0.1,
        HEIGHT: 0.05,
        TOE_LENGTH: 0.08, // Length of toe section
    },
    DETAIL: {
        MUSCLE_RADIUS: 0.04,
        TENDON_RADIUS: 0.02,
    },
    HIP_OFFSET: 0.05, // Added offset for hip connection
};

// Materials with more metallic look
const MATERIALS = {
    JOINTS: new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.9,
        roughness: 0.1,
    }),
    LEGS: new THREE.MeshStandardMaterial({
        color: 0x3a3a3a,
        metalness: 0.8,
        roughness: 0.2,
    }),
    FEET: new THREE.MeshStandardMaterial({
        color: 0x202020,
        metalness: 0.7,
        roughness: 0.3,
    }),
    MUSCLES: new THREE.MeshStandardMaterial({
        color: 0x4a4a4a,
        metalness: 0.6,
        roughness: 0.4,
    }),
};

export interface RobotLegJoints {
    hipJoint: THREE.Group;
    upperLeg: THREE.Group;
    lowerLeg: THREE.Group;
    ankleJoint: THREE.Group;
    foot: THREE.Group;
}

export interface RobotLegProps {
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    isRight?: boolean;
    onLegCreated?: (joints: RobotLegJoints) => void;
}

export const createLeg = (isRight: boolean = true): RobotLegJoints => {
    const legGroup = new THREE.Group();

    // Hip joint with more detail and connection point
    const hipJoint = new THREE.Group();

    // Hip connection to body – adjusted dimensions and position
    const hipConnection = new THREE.Mesh(
        new THREE.CylinderGeometry(
            LEG_DIMENSIONS.JOINT_RADIUS * 1.2,
            LEG_DIMENSIONS.JOINT_RADIUS * 1.2,
            LEG_DIMENSIONS.HIP_WIDTH * 0.8 // Shortened the connection piece
        ),
        MATERIALS.JOINTS
    );
    hipConnection.rotation.z = Math.PI / 2;
    hipConnection.position.x = (isRight ? 1 : -1) * LEG_DIMENSIONS.HIP_OFFSET;
    hipJoint.add(hipConnection);

    // Main hip ball joint – adjusted position
    const hipSphere = new THREE.Mesh(
        new THREE.SphereGeometry(LEG_DIMENSIONS.JOINT_RADIUS),
        MATERIALS.JOINTS
    );
    hipSphere.position.x = (isRight ? 1 : -1) * (LEG_DIMENSIONS.HIP_WIDTH * 0.2); // Moved closer to body
    hipJoint.add(hipSphere);

    // Hip mechanical detail – adjusted position
    const hipDetail = new THREE.Mesh(
        new THREE.CylinderGeometry(
            LEG_DIMENSIONS.JOINT_RADIUS * 0.8,
            LEG_DIMENSIONS.JOINT_RADIUS * 0.6,
            LEG_DIMENSIONS.JOINT_RADIUS * 0.5
        ),
        MATERIALS.JOINTS
    );
    hipDetail.rotation.x = Math.PI / 2;
    hipDetail.position.copy(hipSphere.position);
    hipJoint.add(hipDetail);

    // Add hip joint to leg group
    legGroup.add(hipJoint);

    // Upper leg (thigh) with muscle detail – adjust connection point
    const upperLegGroup = new THREE.Group();
    upperLegGroup.position.copy(hipSphere.position);

    const upperLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(
            LEG_DIMENSIONS.HIP_WIDTH,
            LEG_DIMENSIONS.KNEE_WIDTH,
            LEG_DIMENSIONS.UPPER_LENGTH
        ),
        MATERIALS.LEGS
    );

    // Add muscle details to thigh
    const thighMuscle = new THREE.Mesh(
        new THREE.CapsuleGeometry(
            LEG_DIMENSIONS.DETAIL.MUSCLE_RADIUS,
            LEG_DIMENSIONS.UPPER_LENGTH * 0.6
        ),
        MATERIALS.MUSCLES
    );
    thighMuscle.position.x = LEG_DIMENSIONS.WIDTH * 0.3;
    thighMuscle.rotation.z = 0.1;

    const thighMuscle2 = thighMuscle.clone();
    thighMuscle2.position.x = -LEG_DIMENSIONS.WIDTH * 0.3;
    thighMuscle2.rotation.z = -0.1;

    upperLeg.rotation.x = -Math.PI / 2;
    upperLeg.position.z = LEG_DIMENSIONS.UPPER_LENGTH / 2;
    upperLegGroup.add(upperLeg, thighMuscle, thighMuscle2);
    hipJoint.add(upperLegGroup);

    // Knee joint with enhanced detail
    const kneeJoint = new THREE.Group();
    const kneeSphere = new THREE.Mesh(
        new THREE.SphereGeometry(LEG_DIMENSIONS.JOINT_RADIUS * 0.9),
        MATERIALS.JOINTS
    );
    const kneeCap = new THREE.Mesh(
        new THREE.SphereGeometry(LEG_DIMENSIONS.JOINT_RADIUS * 0.7),
        MATERIALS.JOINTS
    );
    kneeCap.position.x = LEG_DIMENSIONS.JOINT_RADIUS * 0.3;
    kneeJoint.add(kneeSphere, kneeCap);
    kneeJoint.position.z = LEG_DIMENSIONS.UPPER_LENGTH;
    upperLegGroup.add(kneeJoint);

    // Lower leg (shin) with calf muscle
    const lowerLegGroup = new THREE.Group();
    const lowerLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(
            LEG_DIMENSIONS.KNEE_WIDTH,
            LEG_DIMENSIONS.ANKLE_WIDTH,
            LEG_DIMENSIONS.LOWER_LENGTH
        ),
        MATERIALS.LEGS
    );

    // Add calf muscle
    const calfMuscle = new THREE.Mesh(
        new THREE.CapsuleGeometry(
            LEG_DIMENSIONS.DETAIL.MUSCLE_RADIUS * 0.8,
            LEG_DIMENSIONS.LOWER_LENGTH * 0.5
        ),
        MATERIALS.MUSCLES
    );
    calfMuscle.position.x = LEG_DIMENSIONS.WIDTH * 0.25;
    calfMuscle.position.z = -LEG_DIMENSIONS.LOWER_LENGTH * 0.15;
    calfMuscle.rotation.x = 0.2;

    lowerLeg.rotation.x = -Math.PI / 2;
    lowerLeg.position.z = LEG_DIMENSIONS.LOWER_LENGTH / 2;
    lowerLegGroup.add(lowerLeg, calfMuscle);
    kneeJoint.add(lowerLegGroup);

    // Ankle joint with tendons
    const ankleJoint = new THREE.Group();
    const ankleSphere = new THREE.Mesh(
        new THREE.SphereGeometry(LEG_DIMENSIONS.JOINT_RADIUS * 0.8),
        MATERIALS.JOINTS
    );

    // Add tendon details
    const tendon = new THREE.Mesh(
        new THREE.CylinderGeometry(
            LEG_DIMENSIONS.DETAIL.TENDON_RADIUS,
            LEG_DIMENSIONS.DETAIL.TENDON_RADIUS,
            LEG_DIMENSIONS.JOINT_RADIUS * 2
        ),
        MATERIALS.JOINTS
    );
    tendon.position.x = LEG_DIMENSIONS.JOINT_RADIUS * 0.5;

    const tendon2 = tendon.clone();
    tendon2.position.x = -LEG_DIMENSIONS.JOINT_RADIUS * 0.5;

    ankleJoint.add(ankleSphere, tendon, tendon2);
    ankleJoint.position.z = LEG_DIMENSIONS.LOWER_LENGTH;
    lowerLegGroup.add(ankleJoint);

    // Enhanced foot with toe section
    const footGroup = new THREE.Group();

    // Main foot part
    const foot = new THREE.Mesh(
        new THREE.BoxGeometry(
            LEG_DIMENSIONS.FOOT.WIDTH,
            LEG_DIMENSIONS.FOOT.HEIGHT,
            LEG_DIMENSIONS.FOOT.LENGTH - LEG_DIMENSIONS.FOOT.TOE_LENGTH
        ),
        MATERIALS.FEET
    );
    foot.position.z = (LEG_DIMENSIONS.FOOT.LENGTH - LEG_DIMENSIONS.FOOT.TOE_LENGTH) / 2;
    foot.position.y = -LEG_DIMENSIONS.FOOT.HEIGHT / 2;

    // Toe section
    const toes = new THREE.Mesh(
        new THREE.BoxGeometry(
            LEG_DIMENSIONS.FOOT.WIDTH * 0.9,
            LEG_DIMENSIONS.FOOT.HEIGHT * 0.7,
            LEG_DIMENSIONS.FOOT.TOE_LENGTH
        ),
        MATERIALS.FEET
    );
    toes.position.z = LEG_DIMENSIONS.FOOT.LENGTH - LEG_DIMENSIONS.FOOT.TOE_LENGTH / 2;
    toes.position.y = -LEG_DIMENSIONS.FOOT.HEIGHT * 0.6;

    footGroup.add(foot, toes);
    ankleJoint.add(footGroup);

    // Adjust final leg orientation for better body connection
    legGroup.rotation.y = isRight ? -0.05 : 0.05; // Slight rotation adjustment
    legGroup.position.x = (isRight ? 1 : -1) * LEG_DIMENSIONS.HIP_WIDTH * 0.3; // Moved closer to body

    return {
        hipJoint,
        upperLeg: upperLegGroup,
        lowerLeg: lowerLegGroup,
        ankleJoint,
        foot: footGroup,
    };
};

// Update IK solver to handle hip connection better and adjust for parent rotation
export const solveLegIK = (
    targetPos: THREE.Vector3,
    hipJoint: THREE.Group,
    upperLeg: THREE.Group,
    lowerLeg: THREE.Group,
    ankle: THREE.Group,
    jointLimits = {
        HIP: { MIN: -Math.PI / 3, MAX: Math.PI / 3 },
        KNEE: { MIN: 0, MAX: Math.PI * 0.7 },
        ANKLE: { MIN: -Math.PI / 4, MAX: Math.PI / 4 },
    }
) => {
    // Get hip position in world space
    const hipPos = new THREE.Vector3();
    hipJoint.getWorldPosition(hipPos);

    // Convert target to local space relative to hip
    const localTarget = targetPos.clone().sub(hipPos);

    // Calculate distances
    const targetDistance = localTarget.length();
    const upperLength = LEG_DIMENSIONS.UPPER_LENGTH;
    const lowerLength = LEG_DIMENSIONS.LOWER_LENGTH;
    const totalLength = upperLength + lowerLength;

    // Prevent overextension
    if (targetDistance > totalLength * 0.99) {
        localTarget.normalize().multiplyScalar(totalLength * 0.99);
    }

    // Calculate angles
    const directionXZ = Math.atan2(localTarget.x, localTarget.z);
    const horizontalDist = Math.sqrt(localTarget.x * localTarget.x + localTarget.z * localTarget.z);
    const directionY = Math.atan2(localTarget.y, horizontalDist);

    // Subtract parent's rotation so IK is applied relative to the robot's body
    const parentRotationY = hipJoint.parent ? hipJoint.parent.rotation.y : 0;
    const hipRotY = Math.min(Math.max(directionXZ, jointLimits.HIP.MIN), jointLimits.HIP.MAX);
    hipJoint.rotation.y = hipRotY - parentRotationY;

    // Calculate knee angle using law of cosines
    const cosKnee =
        (Math.pow(upperLength, 2) + Math.pow(lowerLength, 2) - Math.pow(targetDistance, 2)) /
        (2 * upperLength * lowerLength);
    const kneeAngle = Math.acos(Math.min(Math.max(-1, cosKnee), 1));

    // Calculate hip angle
    const cosHip =
        (Math.pow(upperLength, 2) + Math.pow(targetDistance, 2) - Math.pow(lowerLength, 2)) /
        (2 * upperLength * targetDistance);
    const hipAngle = Math.acos(Math.min(Math.max(-1, cosHip), 1));

    // Apply angles with joint limits
    const limitedHipAngle = Math.min(
        Math.max(directionY + hipAngle, jointLimits.HIP.MIN),
        jointLimits.HIP.MAX
    );
    upperLeg.rotation.x = limitedHipAngle;

    const limitedKneeAngle = Math.min(
        Math.max(Math.PI - kneeAngle, jointLimits.KNEE.MIN),
        jointLimits.KNEE.MAX
    );
    lowerLeg.rotation.x = limitedKneeAngle;

    // Keep foot parallel to ground with ankle limits
    const totalLegAngle = upperLeg.rotation.x + lowerLeg.rotation.x;
    const targetAnkleAngle = -totalLegAngle + Math.PI / 2;
    ankle.rotation.x = Math.min(
        Math.max(targetAnkleAngle, jointLimits.ANKLE.MIN),
        jointLimits.ANKLE.MAX
    );
};

export default function RobotLeg({ position, rotation, isRight = true, onLegCreated }: RobotLegProps) {
    const legRef = useRef<THREE.Group | null>(null);
    const jointsRef = useRef<RobotLegJoints | null>(null);
    const { scene } = useThree();

    useEffect(() => {
        // Create a new group for the leg
        const legGroup = new THREE.Group();
        legRef.current = legGroup;

        // Create the leg structure
        const joints = createLeg(isRight);
        jointsRef.current = joints;

        // Add the leg group to the scene
        legGroup.add(joints.hipJoint);
        scene.add(legGroup);

        // Set initial position and rotation if provided
        if (position) legGroup.position.copy(position);
        if (rotation) legGroup.rotation.copy(rotation);

        // Notify parent component that the leg is ready
        if (onLegCreated) onLegCreated(joints);

        return () => {
            // Cleanup on unmount
            scene.remove(legGroup);
            legGroup.remove(joints.hipJoint);
            legRef.current = null;
        };
    }, [position, rotation, isRight, onLegCreated, scene]);

    // Walking animation using useFrame
    useFrame((state, delta) => {
        if (!jointsRef.current || !legRef.current) return;
        const time = state.clock.getElapsedTime();
        // Walking cycle parameters
        const cycleTime = 1.0; // Duration of one full step cycle (seconds)
        // Offset phase so right leg is out-of-phase with left
        const phaseOffset = isRight ? 0.5 : 0.0;
        const phase = ((time / cycleTime) + phaseOffset) % 1.0;

        // Get the hip position in world space
        const hipPos = new THREE.Vector3();
        jointsRef.current.hipJoint.getWorldPosition(hipPos);

        // Base target is the projection of hip onto the ground (y=0)
        const baseTarget = new THREE.Vector3(hipPos.x, 0, hipPos.z);

        // Define step parameters
        const stepLength = 0.2; // How far forward/back the foot moves
        const stepHeight = 0.1; // How high the foot lifts during swing phase

        let offset = new THREE.Vector3();
        if (phase < 0.5) {
            // Swing phase: foot moves forward and lifts
            const t = phase / 0.5;
            offset.z = THREE.MathUtils.lerp(-stepLength / 2, stepLength / 2, t);
            offset.y = Math.sin(t * Math.PI) * stepHeight;
        } else {
            // Stance phase: foot moves backward
            const t = (phase - 0.5) / 0.5;
            offset.z = THREE.MathUtils.lerp(stepLength / 2, -stepLength / 2, t);
            offset.y = 0;
        }

        // Rotate the offset vector by the leg group's quaternion so that the movement
        // is relative to the robot's forward direction
        offset.applyQuaternion(legRef.current.quaternion);

        // Compute the target foot position in world space
        const targetPos = baseTarget.clone().add(offset);

        // Apply IK to move the leg toward the target foot position
        solveLegIK(
            targetPos,
            jointsRef.current.hipJoint,
            jointsRef.current.upperLeg,
            jointsRef.current.lowerLeg,
            jointsRef.current.ankleJoint
        );
    });

    // This component manages its own 3D objects so no JSX is returned
    return null;
}
