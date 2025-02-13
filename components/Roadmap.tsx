"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const roadmapItems = [
  {
    year: "2024 Q1-Q2",
    title: "Core Navigation & Perception",
    description:
      "Successfully implemented SLAM and 3D mapping using Intel RealSense D435i camera. Achieved real-time object detection and distance measurement using LMS. Currently working on improving mapping accuracy and object recognition reliability.",
    progress: 80,
    milestones: [
      { title: "SLAM Implementation", status: "completed" },
      { title: "3D Mapping", status: "completed" },
      { title: "Object Detection", status: "completed" },
      { title: "LMS Integration", status: "completed" },
      { title: "Mapping Accuracy Optimization", status: "in-progress" },
    ],
    techStack: ["Intel RealSense D435i", "ROS2", "OpenCV", "Point Cloud Library"],
  },
  {
    year: "2024 Q3-Q4",
    title: "Advanced Manipulation & Interaction",
    description:
      "Development of precise robotic arm control using RayLib visualization for path planning. Implementation of advanced object manipulation algorithms. Enhancement of object recognition to include material properties and grasp points.",
    progress: 20,
    milestones: [
      { title: "Arm Control System", status: "in-progress" },
      { title: "Path Planning", status: "in-progress" },
      { title: "Grasp Point Detection", status: "planned" },
      { title: "Material Recognition", status: "planned" },
      { title: "Dynamic Object Manipulation", status: "planned" },
    ],
    techStack: ["RayLib", "MoveIt", "PyBullet", "TensorRT"],
  },
  {
    year: "2025 Q1-Q2",
    title: "Multi-Robot Coordination",
    description:
      "Integration of swarm robotics capabilities for coordinated navigation and task execution. Development of centralized control system for multiple robots. Implementation of task allocation and resource sharing algorithms.",
    progress: 0,
    milestones: [
      { title: "Swarm Communication Protocol", status: "planned" },
      { title: "Centralized Control System", status: "planned" },
      { title: "Task Allocation Algorithm", status: "planned" },
      { title: "Resource Management", status: "planned" },
      { title: "Multi-Robot Navigation", status: "planned" },
    ],
    techStack: ["ROS2 Multi-Robot", "DDS", "Fleet Management System"],
  },
  {
    year: "2025 Q3-Q4",
    title: "Human-Robot Collaboration",
    description:
      "Implementation of natural language processing for voice commands. Development of gesture recognition for intuitive human-robot interaction. Integration of safety protocols for close human-robot collaboration.",
    progress: 0,
    milestones: [
      { title: "Voice Command System", status: "planned" },
      { title: "Gesture Recognition", status: "planned" },
      { title: "Safety Protocol Integration", status: "planned" },
      { title: "Human Detection & Tracking", status: "planned" },
      { title: "Interactive UI Development", status: "planned" },
    ],
    techStack: ["PyTorch", "MediaPipe", "Web Speech API", "Safety PLC"],
  },
  {
    year: "2026",
    title: "Commercial Product Launch",
    description:
      "Release of our first commercial product line featuring autonomous mobile robots with advanced manipulation capabilities. Integration with smart home systems and launch of cloud-based fleet management platform.",
    progress: 0,
    milestones: [
      { title: "Product Certification", status: "planned" },
      { title: "Manufacturing Setup", status: "planned" },
      { title: "Cloud Platform Development", status: "planned" },
      { title: "Smart Home Integration", status: "planned" },
      { title: "Market Launch", status: "planned" },
    ],
    techStack: ["AWS RoboMaker", "IoT Core", "Smart Home APIs", "Fleet Management"],
  },
]

export default function Roadmap() {
  const [activeYear, setActiveYear] = useState("2024 Q1-Q2")
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-yellow-500"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <section id="roadmap" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-12 text-center text-gradient"
        >
          Our Technology Roadmap
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="sticky top-24 space-y-4">
              {roadmapItems.map((item) => (
                <motion.button
                  key={item.year}
                  className={`w-full text-left p-6 rounded-lg transition-all duration-300 relative overflow-hidden ${activeYear === item.year
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  onClick={() => setActiveYear(item.year)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold">{item.year}</h3>
                    <p className="text-sm mt-2 opacity-90">{item.title}</p>
                    <div className="mt-3 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs mt-1 opacity-75">{item.progress}% Complete</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
          <div className="md:w-2/3">
            {roadmapItems.map((item) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: activeYear === item.year ? 1 : 0, y: activeYear === item.year ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className={`mb-8 p-8 bg-white rounded-lg shadow-lg ${activeYear !== item.year ? "hidden" : ""}`}
              >
                <h3 className="text-3xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600 mb-8">{item.description}</p>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">Key Milestones</h4>
                  <div className="space-y-4">
                    {item.milestones.map((milestone, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-4"
                        onHoverStart={() => setHoveredMilestone(milestone.title)}
                        onHoverEnd={() => setHoveredMilestone(null)}
                        whileHover={{ x: 10 }}
                      >
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(milestone.status)}`} />
                        <span className="text-gray-700">{milestone.title}</span>
                        {hoveredMilestone === milestone.title && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-gray-500"
                          >
                            {milestone.status}
                          </motion.span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">Technology Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.techStack.map((tech, index) => (
                      <motion.span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

