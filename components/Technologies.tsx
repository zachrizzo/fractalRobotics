"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

const technologies = [
  {
    title: "3D Mapping & SLAM",
    description:
      "Using Simultaneous Localization and Mapping (SLAM) algorithms, our robots create accurate 3D maps of your home in real-time, allowing for precise navigation and interaction with the environment.",
    image: "/slam-mapping.jpg",
  },
  {
    title: "Advanced Image Recognition",
    description:
      "Our custom-trained neural networks enable our robots to recognize and categorize objects, faces, and even emotions, allowing for more natural and context-aware interactions.",
    image: "/image-recognition.jpg",
  },
  {
    title: "Natural Language Processing",
    description:
      "Sophisticated NLP models allow our robots to understand and respond to complex voice commands, making human-robot interaction as natural as talking to a person.",
    image: "/nlp.jpg",
  },
  {
    title: "Adaptive Learning",
    description:
      "Our robots use reinforcement learning techniques to continuously improve their performance, adapting to your home's unique layout and your personal preferences over time.",
    image: "/adaptive-learning.jpg",
  },
]

export default function Technologies() {
  const [activeIndex, setActiveIndex] = useState(0)

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
            <Image
              src={technologies[activeIndex].image || "/placeholder.svg"}
              alt={technologies[activeIndex].title}
              width={600}
              height={400}
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
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
                  className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                    activeIndex === index ? "bg-white shadow-lg" : "hover:bg-white hover:shadow-md"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">{tech.title}</h3>
                  {activeIndex === index && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-gray-600"
                    >
                      {tech.description}
                    </motion.p>
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

