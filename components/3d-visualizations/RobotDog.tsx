import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RobotLeg, { RobotLegJoints, solveLegIK } from "./RobotLeg";

// Constants for the humanoid robot
const ROBOT_DIMENSIONS = {
    BODY: {
        WIDTH: 0.4,     // Torso width
        HEIGHT: 0.6,    // Torso height
        DEPTH: 0.3,     // Torso depth
        WAIST_SCALE: 0.8, // Waist is slightly narrower than chest
    },
    SHOULDERS: {
        WIDTH: 0.5,
        HEIGHT: 0.1,
        DEPTH: 0.2,
    },
    LEG: {
        UPPER_LENGTH: 0.4,
        LOWER_LENGTH: 0.45,
        HIP_WIDTH: 0.08,
        KNEE_WIDTH: 0.07,
        ANKLE_WIDTH: 0.06,
        WIDTH: 0.08,
        JOINT_RADIUS: 0.05,
    },
    FOOT: {
        LENGTH: 0.2,
        WIDTH: 0.1,
        HEIGHT: 0.05,
    },
    HEAD: {
        RADIUS: 0.15,
        NECK_HEIGHT: 0.1,
    },
};

// IK and walking settings
const IK_SETTINGS = {
    STEP_HEIGHT: 0.15,
    STRIDE_LENGTH: 0.3,
    WALK_SPEED: 0.6,
    STANDING_HEIGHT: 0.85,
    JOINT_LIMITS: {
        HIP: {
            MIN: -Math.PI / 3,
            MAX: Math.PI / 3,
        },
        KNEE: {
            MIN: 0,
            MAX: Math.PI * 0.7,
        },
        ANKLE: {
            MIN: -Math.PI / 4,
            MAX: Math.PI / 4,
        },
    },
};

// Compute hip joint positions relative to the robot group.
// The hip joints are part of the lower torso, which is offset in the body.
const HIP_OFFSET_Y =
    IK_SETTINGS.STANDING_HEIGHT - (ROBOT_DIMENSIONS.BODY.HEIGHT * 0.1 + ROBOT_DIMENSIONS.BODY.HEIGHT * 0.2);
const HIP_OFFSET_X =
    (ROBOT_DIMENSIONS.BODY.WIDTH * ROBOT_DIMENSIONS.BODY.WAIST_SCALE) / 2 + ROBOT_DIMENSIONS.LEG.HIP_WIDTH / 2;

// Materials
const MATERIALS = {
    BODY: new THREE.MeshStandardMaterial({
        color: 0x2b2b2b,
        metalness: 0.8,
        roughness: 0.2,
    }),
    JOINTS: new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.9,
        roughness: 0.1,
    }),
    LEGS: new THREE.MeshStandardMaterial({
        color: 0x3a3a3a,
        metalness: 0.7,
        roughness: 0.3,
    }),
    FEET: new THREE.MeshStandardMaterial({
        color: 0x202020,
        metalness: 0.9,
        roughness: 0.1,
    }),
    ACCENTS: new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2,
    }),
    GLASS: new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        metalness: 0,
        roughness: 0,
        transmission: 1,
        thickness: 0.5,
    }),
};

interface LegConfig {
    joints: RobotLegJoints;
    position: THREE.Vector3;
    phase: number;
    isGrounded: boolean;
}

// Animation settings
const ANIMATION_SETTINGS = {
    KICK_DURATION: 2.0,    // seconds
    KICK_HEIGHT: 0.3,      // maximum vertical lift
    KICK_EXTENSION: 0.4,   // forward extension
    RETURN_DURATION: 1.0,  // return to starting position
};

// Helper function for foot trajectory (using a Bezier curve during swing phase)
const calculateFootTrajectory = (
    startPos: THREE.Vector3,
    endPos: THREE.Vector3,
    phase: number,
    height: number
): THREE.Vector3 => {
    const trajectory = new THREE.Vector3();
    if (phase <= 0.5) {
        const t = phase * 2;
        const p0 = startPos;
        const p1 = startPos.clone().add(new THREE.Vector3(0, height * 2, 0));
        const p2 = endPos.clone().add(new THREE.Vector3(0, height * 2, 0));
        const p3 = endPos;
        trajectory.x =
            Math.pow(1 - t, 3) * p0.x +
            3 * Math.pow(1 - t, 2) * t * p1.x +
            3 * (1 - t) * t * t * p2.x +
            Math.pow(t, 3) * p3.x;
        trajectory.y =
            Math.pow(1 - t, 3) * p0.y +
            3 * Math.pow(1 - t, 2) * t * p1.y +
            3 * (1 - t) * t * t * p2.y +
            Math.pow(t, 3) * p3.y;
        trajectory.z =
            Math.pow(1 - t, 3) * p0.z +
            3 * Math.pow(1 - t, 2) * t * p1.z +
            3 * (1 - t) * t * t * p2.z +
            Math.pow(t, 3) * p3.z;
    } else {
        const t = (phase - 0.5) * 2;
        trajectory.lerpVectors(startPos, endPos, t);
        trajectory.y = 0; // foot stays on ground
    }
    return trajectory;
};

const calculateSupportPolygon = (legs: LegConfig[]): THREE.Vector2[] => {
    const groundedLegs = legs.filter((leg) => leg.isGrounded);
    if (groundedLegs.length < 3) return [];
    const points = groundedLegs.map((leg) => {
        const worldPos = new THREE.Vector3();
        leg.joints.foot.getWorldPosition(worldPos);
        return new THREE.Vector2(worldPos.x, worldPos.z);
    });
    return points.sort((a, b) => a.x - b.x || a.y - b.y);
};

const updateLegPositions = (leg: LegConfig, time: number, isKickingLeg: boolean) => {
    const cycleTime = ANIMATION_SETTINGS.KICK_DURATION + ANIMATION_SETTINGS.RETURN_DURATION;
    const normalizedTime = time % cycleTime;
    const kickPhase = normalizedTime / ANIMATION_SETTINGS.KICK_DURATION;
    const isKicking = kickPhase <= 1;
    const restingPos = leg.position.clone();
    let targetPos = restingPos.clone();
    if (isKickingLeg && isKicking) {
        const phase = Math.min(kickPhase, 1);
        const heightCurve = Math.sin(phase * Math.PI);
        const forwardCurve = Math.sin(phase * Math.PI * 0.5);
        targetPos.y += heightCurve * ANIMATION_SETTINGS.KICK_HEIGHT;
        targetPos.z += forwardCurve * ANIMATION_SETTINGS.KICK_EXTENSION;
    } else if (isKickingLeg) {
        const returnPhase =
            (kickPhase - 1) / (ANIMATION_SETTINGS.RETURN_DURATION / ANIMATION_SETTINGS.KICK_DURATION);
        targetPos.lerp(restingPos, returnPhase);
    }
    solveLegIK(
        targetPos,
        leg.joints.hipJoint,
        leg.joints.upperLeg,
        leg.joints.lowerLeg,
        leg.joints.ankleJoint
    );
    leg.isGrounded = !isKickingLeg || !isKicking;
};

export default function HumanoidRobot() {
    const [isLoading, setIsLoading] = useState(true);
    const robotRef = useRef<THREE.Group | null>(null);
    const legsRef = useRef<LegConfig[]>([]);

    // When a leg is created, store its joints and compute its base position
    const handleLegCreated = (joints: RobotLegJoints, index: number) => {
        // Left leg (index 0) at negative X, right leg (index 1) at positive X.
        const x = index === 0 ? -HIP_OFFSET_X : HIP_OFFSET_X;
        const position = new THREE.Vector3(x, HIP_OFFSET_Y, 0);
        legsRef.current[index] = { joints, position, phase: index * 0.5, isGrounded: true };
    };

    // Remove loading spinner after mount.
    useEffect(() => {
        setIsLoading(false);
    }, []);

    // Animation loop to update leg IK
    useEffect(() => {
        let lastTime = 0;
        const animate = (time: number) => {
            const currentTime = time * 0.001;
            lastTime = currentTime;
            legsRef.current.forEach((leg, index) => {
                // For demonstration, let the right leg (index 1) perform the kicking motion.
                updateLegPositions(leg, currentTime, index === 1);
            });
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, []);

    // Scene: Contains the robot body and legs.
    const Scene = () => {
        return (
            <group ref={robotRef}>
                {/* Robot Body Group */}
                <group position={[0, IK_SETTINGS.STANDING_HEIGHT, 0]}>
                    {/* Upper Torso */}
                    <mesh
                        geometry={new THREE.BoxGeometry(
                            ROBOT_DIMENSIONS.BODY.WIDTH,
                            ROBOT_DIMENSIONS.BODY.HEIGHT * 0.6,
                            ROBOT_DIMENSIONS.BODY.DEPTH
                        )}
                        material={MATERIALS.BODY}
                        position={[0, ROBOT_DIMENSIONS.BODY.HEIGHT * 0.2, 0]}
                    />
                    {/* Lower Torso with Hip Joints */}
                    <group position={[0, -ROBOT_DIMENSIONS.BODY.HEIGHT * 0.1, 0]}>
                        <mesh
                            geometry={new THREE.BoxGeometry(
                                ROBOT_DIMENSIONS.BODY.WIDTH * ROBOT_DIMENSIONS.BODY.WAIST_SCALE,
                                ROBOT_DIMENSIONS.BODY.HEIGHT * 0.4,
                                ROBOT_DIMENSIONS.BODY.DEPTH * ROBOT_DIMENSIONS.BODY.WAIST_SCALE
                            )}
                            material={MATERIALS.BODY}
                        />
                        {/* Left Hip Joint */}
                        <mesh
                            geometry={new THREE.CylinderGeometry(
                                ROBOT_DIMENSIONS.LEG.JOINT_RADIUS * 1.2,
                                ROBOT_DIMENSIONS.LEG.JOINT_RADIUS * 1.2,
                                ROBOT_DIMENSIONS.LEG.HIP_WIDTH,
                                16
                            )}
                            material={MATERIALS.JOINTS}
                            rotation={[0, 0, Math.PI / 2]}
                            position={[
                                -((ROBOT_DIMENSIONS.BODY.WIDTH * ROBOT_DIMENSIONS.BODY.WAIST_SCALE) / 2 +
                                    ROBOT_DIMENSIONS.LEG.HIP_WIDTH / 2),
                                -ROBOT_DIMENSIONS.BODY.HEIGHT * 0.2,
                                0,
                            ]}
                        />
                        {/* Right Hip Joint */}
                        <mesh
                            geometry={new THREE.CylinderGeometry(
                                ROBOT_DIMENSIONS.LEG.JOINT_RADIUS * 1.2,
                                ROBOT_DIMENSIONS.LEG.JOINT_RADIUS * 1.2,
                                ROBOT_DIMENSIONS.LEG.HIP_WIDTH,
                                16
                            )}
                            material={MATERIALS.JOINTS}
                            rotation={[0, 0, Math.PI / 2]}
                            position={[
                                (ROBOT_DIMENSIONS.BODY.WIDTH * ROBOT_DIMENSIONS.BODY.WAIST_SCALE) / 2 +
                                ROBOT_DIMENSIONS.LEG.HIP_WIDTH / 2,
                                -ROBOT_DIMENSIONS.BODY.HEIGHT * 0.2,
                                0,
                            ]}
                        />
                    </group>
                    {/* Shoulders */}
                    <mesh
                        geometry={new THREE.BoxGeometry(
                            ROBOT_DIMENSIONS.SHOULDERS.WIDTH,
                            ROBOT_DIMENSIONS.SHOULDERS.HEIGHT,
                            ROBOT_DIMENSIONS.SHOULDERS.DEPTH
                        )}
                        material={MATERIALS.JOINTS}
                        position={[0, ROBOT_DIMENSIONS.BODY.HEIGHT * 0.4, 0]}
                    />
                    {/* Neck */}
                    <mesh
                        geometry={new THREE.CylinderGeometry(0.05, 0.07, ROBOT_DIMENSIONS.HEAD.NECK_HEIGHT, 16)}
                        material={MATERIALS.JOINTS}
                        position={[0, ROBOT_DIMENSIONS.BODY.HEIGHT * 0.5, 0]}
                    />
                    {/* Head */}
                    <group position={[0, ROBOT_DIMENSIONS.BODY.HEIGHT * 0.5 + ROBOT_DIMENSIONS.HEAD.NECK_HEIGHT, 0]}>
                        <mesh
                            geometry={new THREE.SphereGeometry(ROBOT_DIMENSIONS.HEAD.RADIUS, 32, 32)}
                            material={MATERIALS.BODY}
                        />
                        {/* Face Plate */}
                        <mesh
                            geometry={new THREE.BoxGeometry(
                                ROBOT_DIMENSIONS.HEAD.RADIUS * 1.5,
                                ROBOT_DIMENSIONS.HEAD.RADIUS * 1.2,
                                ROBOT_DIMENSIONS.HEAD.RADIUS * 0.3
                            )}
                            material={MATERIALS.JOINTS}
                            position={[0, 0, ROBOT_DIMENSIONS.HEAD.RADIUS * 0.7]}
                        />
                        {/* Eyes */}
                        <mesh
                            geometry={new THREE.SphereGeometry(0.03, 16, 16)}
                            material={
                                new THREE.MeshPhongMaterial({
                                    color: 0x00ff00,
                                    emissive: 0x00ff00,
                                    emissiveIntensity: 0.5,
                                })
                            }
                            position={[-0.08, 0, ROBOT_DIMENSIONS.HEAD.RADIUS * 0.85]}
                        />
                        <mesh
                            geometry={new THREE.SphereGeometry(0.03, 16, 16)}
                            material={
                                new THREE.MeshPhongMaterial({
                                    color: 0x00ff00,
                                    emissive: 0x00ff00,
                                    emissiveIntensity: 0.5,
                                })
                            }
                            position={[0.08, 0, ROBOT_DIMENSIONS.HEAD.RADIUS * 0.85]}
                        />
                    </group>
                </group>

                {/* Legs: Positioned at the computed hip joint positions */}
                {[0, 1].map((index) => (
                    <RobotLeg
                        key={index}
                        position={new THREE.Vector3(
                            index === 0 ? -HIP_OFFSET_X : HIP_OFFSET_X,
                            HIP_OFFSET_Y,
                            0
                        )}
                        isRight={index === 1}
                        onLegCreated={(joints) => handleLegCreated(joints, index)}
                    />
                ))}
            </group>
        );
    };

    return (
        <div className="relative">
            <div className="w-full h-full" style={{ height: "100vh" }}>
                <Canvas shadows camera={{ position: [2, 2, 2], fov: 60 }}>
                    <Scene />
                    <OrbitControls enableDamping dampingFactor={0.05} maxDistance={10} minDistance={1} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
                    <directionalLight position={[-5, 5, -5]} intensity={0.3} color={0x4477ff} />
                    <spotLight position={[0, 5, 2]} intensity={0.5} angle={0.5} penumbra={0.5} castShadow />
                </Canvas>
            </div>
            {/* Loading spinner (will disappear after mount) */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
        </div>
    );
}
