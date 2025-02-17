"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import PracticalApplications from "./PracticalApplications"

const roadmapItems = [
  {
    year: "2025 Q1-Q2",
    title: "Core Navigation & Reinforcement Learning",
    description:
      "Implementation of advanced locomotion using reinforcement learning for humanoid robots. Developing robust SLAM and 3D mapping using Intel RealSense D435i camera. Our RL approach combines PPO (Proximal Policy Optimization) with curriculum learning to master bipedal walking, starting from simple standing to complex dynamic movements. Integration of fall recovery and adaptive gait optimization for various terrains.",
    progress: 20,
    milestones: [
      { title: "Basic Bipedal Standing", status: "completed" },
      { title: "RL Training Pipeline Setup", status: "in-progress" },
      { title: "SLAM Implementation", status: "in-progress" },
      { title: "Dynamic Walking Simulation", status: "planned" },
      { title: "Real-world Gait Transfer", status: "planned" },
    ],
    techStack: ["PyTorch", "Intel RealSense D435i", "ROS2", "Isaac Gym", "OpenCV"],
  },
  {
    year: "2025 Q3-Q4",
    title: "Advanced Manipulation & Environmental Interaction",
    description:
      "Development of precise robotic arm control with emphasis on human-like movements. Implementation of advanced object manipulation using multi-modal learning combining visual, tactile, and force feedback. Enhanced perception system for material property understanding and dynamic grasp planning. Integration of whole-body motion planning for coordinated manipulation tasks.",
    progress: 0,
    milestones: [
      { title: "Dexterous Hand Control", status: "planned" },
      { title: "Multi-modal Learning System", status: "planned" },
      { title: "Force-aware Manipulation", status: "planned" },
      { title: "Whole-body Motion Planning", status: "planned" },
      { title: "Human-like Movement Patterns", status: "planned" },
    ],
    techStack: ["PyTorch", "MoveIt", "PyBullet", "TensorRT", "ROS2 Control"],
  },
  {
    year: "2026 Q1-Q2",
    title: "Human-Robot Collaboration & Safety",
    description:
      "Implementation of advanced human-robot interaction capabilities including natural language processing, gesture recognition, and social navigation. Development of comprehensive safety systems with real-time obstacle avoidance and human proximity adaptation. Integration of emotional intelligence and contextual awareness for more natural interactions.",
    progress: 0,
    milestones: [
      { title: "Natural Language Understanding", status: "planned" },
      { title: "Social Navigation", status: "planned" },
      { title: "Real-time Safety Systems", status: "planned" },
      { title: "Gesture Recognition", status: "planned" },
      { title: "Emotional Response System", status: "planned" },
    ],
    techStack: ["Transformer Models", "MediaPipe", "Safety PLC", "ROS2 Navigation"],
  },
  {
    year: "2026 Q3-Q4",
    title: "Commercial Applications & Deployment",
    description:
      "Launch of initial commercial applications focusing on warehouse automation and home assistance. Development of cloud-based fleet management and remote operation capabilities. Implementation of task-specific optimizations for various industrial and domestic scenarios.",
    progress: 0,
    milestones: [
      { title: "Warehouse Automation Suite", status: "planned" },
      { title: "Home Assistant Features", status: "planned" },
      { title: "Cloud Management Platform", status: "planned" },
      { title: "Remote Operation System", status: "planned" },
      { title: "Industry-specific Solutions", status: "planned" },
    ],
    techStack: ["AWS RoboMaker", "Cloud Robotics", "5G Integration", "Enterprise Security"],
  },
]

export default function Roadmap() {
  const [activeYear, setActiveYear] = useState("2025 Q1-Q2")
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
    <>
      <PracticalApplications />
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
    </>
  )
}

