"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const roadmapItems = [
  {
    year: "2023",
    title: "Foundation and Prototyping",
    description:
      "Development of initial AI models, integration of Intel RealSense D435i camera, and creation of first wheeled robot prototype. Implementation of basic SLAM algorithms for 3D mapping.",
  },
  {
    year: "2024",
    title: "Advanced Perception and Interaction",
    description:
      "Release of our first commercial product: an intelligent wheeled robot with advanced image recognition capabilities, natural language processing for complex voice commands, and refined 3D mapping using improved SLAM techniques.",
  },
  {
    year: "2025",
    title: "Cognitive Computing and Adaptive Learning",
    description:
      "Integration of more sophisticated AI models for complex decision-making, implementation of reinforcement learning for adaptive behavior, and development of advanced grasping mechanisms for object manipulation.",
  },
  {
    year: "2026",
    title: "Bipedal Robotics and Enhanced Mobility",
    description:
      "Beginning of research and development into bipedal robots, incorporating advanced balance control systems and gait optimization algorithms. Further refinement of object recognition and manipulation capabilities.",
  },
  {
    year: "2027",
    title: "Full Home Integration and Swarm Intelligence",
    description:
      "Launch of a comprehensive home robotics system, featuring both wheeled and bipedal robots working in harmony. Implementation of swarm intelligence algorithms for coordinated multi-robot tasks and home-wide distributed intelligence.",
  },
]

export default function Roadmap() {
  const [activeYear, setActiveYear] = useState("2023")

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
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                    activeYear === item.year
                      ? "bg-primary-color text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveYear(item.year)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h3 className="text-xl font-semibold">{item.year}</h3>
                  <p className="text-sm mt-2">{item.title}</p>
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
                className={`mb-8 p-6 bg-white rounded-lg shadow-lg ${activeYear !== item.year ? "hidden" : ""}`}
              >
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

