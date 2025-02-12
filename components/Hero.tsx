"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Link from "next/link"

export default function Hero() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const mousePosition = useRef({ x: 0, y: 0 })
  const lastInteractionTime = useRef(new Array(64).fill(0))

  const handleMouseMove = useCallback((event: MouseEvent) => {
    mousePosition.current = { x: event.clientX, y: event.clientY }
  }, [])

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Create robot arm
    const createRobotArm = () => {
      const armGroup = new THREE.Group()

      // Materials
      const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x4a4a4a })
      const armMaterial = new THREE.MeshPhongMaterial({ color: 0x6a6a6a })
      const jointMaterial = new THREE.MeshPhongMaterial({ color: 0x4285f4 })

      // Base
      const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32)
      const base = new THREE.Mesh(baseGeometry, baseMaterial)
      armGroup.add(base)

      // Shoulder joint
      const shoulderGeometry = new THREE.SphereGeometry(0.2, 32, 32)
      const shoulder = new THREE.Mesh(shoulderGeometry, jointMaterial)
      shoulder.position.y = 0.2
      armGroup.add(shoulder)

      // Lower arm
      const lowerArmGeometry = new THREE.BoxGeometry(0.2, 1, 0.2)
      const lowerArm = new THREE.Mesh(lowerArmGeometry, armMaterial)
      lowerArm.position.y = 0.7
      shoulder.add(lowerArm)

      // Elbow joint
      const elbowGeometry = new THREE.SphereGeometry(0.15, 32, 32)
      const elbow = new THREE.Mesh(elbowGeometry, jointMaterial)
      elbow.position.y = 0.5
      lowerArm.add(elbow)

      // Upper arm
      const upperArmGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15)
      const upperArm = new THREE.Mesh(upperArmGeometry, armMaterial)
      upperArm.position.y = 0.4
      elbow.add(upperArm)

      // Wrist joint
      const wristGeometry = new THREE.SphereGeometry(0.1, 32, 32)
      const wrist = new THREE.Mesh(wristGeometry, jointMaterial)
      wrist.position.y = 0.4
      upperArm.add(wrist)

      // Grasper base
      const grasperBaseGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.1)
      const grasperBase = new THREE.Mesh(grasperBaseGeometry, armMaterial)
      grasperBase.position.y = 0.05
      wrist.add(grasperBase)

      // Grasper prongs
      const prongGeometry = new THREE.BoxGeometry(0.05, 0.2, 0.05)
      const leftProng = new THREE.Mesh(prongGeometry, jointMaterial)
      leftProng.position.set(-0.075, 0.1, 0)
      const rightProng = new THREE.Mesh(prongGeometry, jointMaterial)
      rightProng.position.set(0.075, 0.1, 0)
      grasperBase.add(leftProng, rightProng)

      return armGroup
    }

    // Create a grid of robot arms
    const robotArms: THREE.Group[] = []
    const gridSize = { rows: 8, cols: 8 }
    const spacing = 4 // Increased spacing between arms
    const offsetX = ((gridSize.cols - 1) * spacing) / 2
    const offsetZ = ((gridSize.rows - 1) * spacing) / 2

    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        const robotArm = createRobotArm()
        robotArm.position.set(col * spacing - offsetX, 0, row * spacing - offsetZ)
        scene.add(robotArm)
        robotArms.push(robotArm)
      }
    }

    // Create a larger platform
    const platformSize = Math.max(gridSize.rows, gridSize.cols) * spacing + 5
    const planeGeometry = new THREE.PlaneGeometry(platformSize, platformSize)
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc, side: THREE.DoubleSide })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = Math.PI / 2
    plane.position.y = -0.1
    scene.add(plane)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Adjust camera position for a better fixed view
    camera.position.set(0, 8, 12)
    camera.lookAt(0, 0, 0)

    // OrbitControls for panning
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controls.maxPolarAngle = Math.PI / 3
    controls.minPolarAngle = Math.PI / 6

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()

      const currentTime = Date.now()

      // Update mouse position for raycaster
      mouse.x = (mousePosition.current.x / window.innerWidth) * 2 - 1
      mouse.y = -(mousePosition.current.y / window.innerHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(plane)

      if (intersects.length > 0) {
        const targetPoint = intersects[0].point

        robotArms.forEach((robotArm, index) => {
          const armPosition = new THREE.Vector3()
          robotArm.getWorldPosition(armPosition)

          // Calculate the distance from the arm to the mouse
          const distanceToMouse = armPosition.distanceTo(targetPoint)

          // Check if the arm is being interacted with
          const isInteracting = distanceToMouse < 4 // Interaction radius

          if (isInteracting) {
            lastInteractionTime.current[index] = currentTime

            // Calculate the direction from the arm to the mouse
            const direction = new THREE.Vector3().subVectors(targetPoint, armPosition)

            // Rotate base
            robotArm.rotation.y = Math.atan2(direction.x, direction.z)

            // Update robot arm based on mouse position
            const shoulder = robotArm.children[1] as THREE.Object3D
            const lowerArm = shoulder?.children[0] as THREE.Object3D
            const elbow = lowerArm?.children[0] as THREE.Object3D

            if (shoulder && lowerArm && elbow) {
              // Calculate distances
              const horizontalDistance = Math.sqrt(direction.x * direction.x + direction.z * direction.z)
              const verticalDistance = direction.y

              // Inverse Kinematics
              const armLength = 1.8 // Total length of the arm
              const reach = Math.min(horizontalDistance, armLength)
              const height = Math.max(0, Math.min(verticalDistance, Math.sqrt(armLength * armLength - reach * reach)))

              const shoulderAngle = Math.atan2(height, reach)
              const elbowAngle = Math.acos((reach * reach + height * height) / (2 * armLength * 0.9)) - shoulderAngle

              // Apply rotations with easing
              const easing = 0.1
              shoulder.rotation.z += (-shoulderAngle - shoulder.rotation.z) * easing
              elbow.rotation.z += (-elbowAngle - elbow.rotation.z) * easing
            }
          } else {
            // Perform robotic arm animation when not interacting
            const time = currentTime * 0.001 // Convert to seconds
            const row = Math.floor(index / gridSize.cols)
            const col = index % gridSize.cols

            // Create a more mechanical, robotic movement
            const baseRotation = Math.sin(time * 0.5 + col * 0.2 + row * 0.2) * 0.3
            robotArm.rotation.y = baseRotation

            const shoulder = robotArm.children[1] as THREE.Object3D
            const lowerArm = shoulder?.children[0] as THREE.Object3D
            const elbow = lowerArm?.children[0] as THREE.Object3D

            if (shoulder && lowerArm && elbow) {
              // Create a more precise, stepped movement for shoulder and elbow
              const shoulderAngle = Math.sin(time + col * 0.5 + row * 0.5) > 0 ? 0.2 : -0.2
              const elbowAngle = Math.cos(time * 1.5 + col * 0.5 + row * 0.5) > 0 ? 0.4 : -0.4

              // Apply rotations with easing for smoother transitions
              const easing = 0.05
              shoulder.rotation.z += (shoulderAngle - shoulder.rotation.z) * easing
              elbow.rotation.z += (elbowAngle - elbow.rotation.z) * easing
            }
          }
        })
      }

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    // Set loading to false when the scene is ready
    setIsLoading(false)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [handleMouseMove])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4 text-gray-800"
        >
          Welcome to Fractal Robotics
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl mb-8 text-gray-600"
        >
          Building truly intelligent robots for your home
        </motion.p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="#roadmap"
            className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Explore Our Vision
          </Link>
        </motion.div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </section>
  )
}

