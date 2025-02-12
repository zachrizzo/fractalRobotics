"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function AboutUs() {
  return (
    <section id="about" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-12 text-center text-gradient"
        >
          About Fractal Robotics
        </motion.h2>
        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <Image
              src="/team-photo.jpg"
              alt="Fractal Robotics team"
              width={500}
              height={300}
              objectFit="cover"
              className="rounded-lg shadow-lg w-full hover-scale"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 text-gray-600 space-y-4"
          >
            <p className="text-xl">
              At Fractal Robotics, we're pioneering the future of home robotics. Our team, led by Zach Rizzo (Software
              Engineer), Collin Hertzer (Mechanical Engineer), and Raj (AI Specialist), combines expertise in
              cutting-edge AI, computer vision, and advanced robotics to create truly intelligent home assistants.
            </p>
            <p className="text-xl">
              We're leveraging state-of-the-art technologies like the Intel RealSense D435i camera for precise 3D
              mapping and depth sensing. This allows our robots to navigate complex home environments with unprecedented
              accuracy.
            </p>
            <p className="text-xl">
              Our focus on advanced AI and machine learning, particularly in areas like image recognition and natural
              language processing, enables our robots to understand and interact with their environment in ways
              previously thought impossible for home robotics.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

