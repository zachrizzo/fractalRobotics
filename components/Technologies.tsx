"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import the components with no SSR
const RobotDog = dynamic(() => import("./3d-visualizations/RobotDog"), { ssr: false })
const TrainingRobotics = dynamic(() => import("./TrainingRobotics"), { ssr: false })

const technologies = [
  {
    title: "Reinforcement Learning with Isaac Sim",
    description:
      "Our advanced reinforcement learning pipeline leverages NVIDIA's Isaac Sim for photorealistic robot training. This enables us to train complex robotic behaviors in a physically accurate virtual environment before deploying to real robots, significantly accelerating development and ensuring safety.",
    technicalDetails: [
      "Physics-accurate simulation with PhysX 5.0",
      "Photorealistic rendering using RTX Real-Time Ray Tracing",
      "Integration with popular RL frameworks (PyTorch, RLlib)",
      "Domain randomization for robust policy learning",
      "Parallel training across multiple simulation instances",
      "Seamless sim-to-real transfer learning"
    ],
    visualization: "trainingRobotics"
  },
  {
    title: "3D Mapping & SLAM",
    description:
      "Our robot utilizes Intel RealSense D435i camera for precise 3D mapping and SLAM (Simultaneous Localization and Mapping). This enables real-time environment mapping with depth sensing accuracy up to 10 meters, perfect for indoor navigation and spatial awareness.",
    technicalDetails: [
      "Depth sensing range: 0.2 to 10 meters",
      "Field of View (FoV): 87° × 58°",
      "Depth resolution: Up to 1280 × 720 pixels",
      "Frame rate: 90 FPS for depth streams",
      "Real-time point cloud generation",
    ],
    visualization: "robotDog"
  },
  {
    title: "RayLib Visualization",
    description:
      "Leveraging RayLib's powerful 3D rendering capabilities, we provide real-time visualization of the robot's environment, mapping data, and navigation paths. This allows for intuitive monitoring and interaction with the robot's perception system.",
    technicalDetails: [
      "Real-time 3D rendering at 60+ FPS",
      "OpenGL-based graphics pipeline",
      "Custom shaders for point cloud visualization",
      "Interactive camera controls",
      "Live data streaming and visualization",
    ],
    image: "/raylib-viz.jpg",
  },
  {
    title: "LMS Distance Measurement",
    description:
      "Our advanced Laser Measurement System (LMS) provides precise distance measurements to objects in real-time. Combined with our object detection system, this enables accurate spatial awareness and safe navigation in dynamic environments.",
    technicalDetails: [
      "Measurement accuracy: ±2mm",
      "Scanning angle: 270°",
      "Angular resolution: 0.25°/0.5°",
      "Scanning frequency: 25/50 Hz",
      "Protection class: IP65",
    ],
    image: "/lms-system.jpg",
  },
  {
    title: "Object Detection & Recognition",
    description:
      "Using state-of-the-art computer vision algorithms and the Intel RealSense D435i's high-resolution RGB camera, our robot can detect, classify, and track objects in real-time, enabling intelligent interaction with its environment.",
    technicalDetails: [
      "RGB resolution: 1920 × 1080 at 30 FPS",
      "Object detection latency: <50ms",
      "Support for 80+ object classes",
      "Real-time object tracking",
      "Distance estimation accuracy: ±1cm",
    ],
    image: "/object-detection.jpg",
  },
  {
    title: "Large Language Model Integration",
    description:
      "Our system leverages state-of-the-art Large Language Models to enable natural interaction and complex decision-making. The LLMs act as high-level planners, breaking down complex tasks into actionable steps and providing contextual understanding of the environment and user instructions.",
    technicalDetails: [
      "Integration with advanced LLMs (Claude, GPT-4)",
      "Real-time task decomposition and planning",
      "Natural language understanding and generation",
      "Context-aware decision making",
      "Multi-modal reasoning capabilities",
      "Efficient prompt engineering and chain-of-thought"
    ],
    visualization: "trainingRobotics"
  },
  {
    title: "Multi-Modal Vision System",
    description:
      "Our advanced vision system combines multiple neural architectures to provide comprehensive scene understanding. By integrating various vision models, we enable robust perception across different lighting conditions and environments, supporting tasks from navigation to manipulation.",
    technicalDetails: [
      "Real-time semantic segmentation",
      "3D object detection and pose estimation",
      "Visual SLAM for mapping and localization",
      "Multi-camera fusion and depth integration",
      "Scene graph generation and relationship inference",
      "Transfer learning from pre-trained vision models"
    ],
    visualization: "trainingRobotics"
  },
]

export default function Technologies() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)

  // Helper function to render the appropriate visualization
  const renderVisualization = (type: string) => {
    switch (type) {
      case "robotDog":
        return <RobotDog />
      case "trainingRobotics":
        return <TrainingRobotics />
      default:
        return null
    }
  }

  return (
    <section id="technologies" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-12 text-center text-gradient"
        >
          Our Cutting-Edge Technologies
        </motion.h2>
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <div className="relative aspect-[4/3] w-full">
              {renderVisualization(technologies[activeIndex].visualization || 'default')}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg z-10"
              >
                {showTechnicalDetails ? "Hide Details" : "Show Technical Specs"}
              </motion.button>
            </div>
          </motion.div>
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${activeIndex === index ? "bg-white shadow-lg" : "hover:bg-white hover:shadow-md"
                    }`}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">{tech.title}</h3>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-gray-600 mb-4">{tech.description}</p>
                      {showTechnicalDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 bg-gray-50 p-4 rounded-lg"
                        >
                          <h4 className="text-lg font-semibold mb-2 text-blue-600">
                            Technical Specifications:
                          </h4>
                          <ul className="list-disc list-inside space-y-2">
                            {tech.technicalDetails.map((detail, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-gray-700"
                              >
                                {detail}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

