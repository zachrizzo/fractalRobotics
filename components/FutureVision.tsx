import { motion } from "framer-motion"
import Image from "next/image"

export default function FutureVision() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-12 text-center text-gray-800"
        >
          Our Future Vision
        </motion.h2>
        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 text-gray-600"
          >
            <p className="text-xl mb-4">
              At Fractal Robotics, we're not just focused on today's home automation solutions. We're constantly
              innovating and looking towards the future of smart living.
            </p>
            <p className="text-xl mb-4">
              Our vision includes AI-powered homes that anticipate your needs, seamless integration of robotics in daily
              life, and sustainable living solutions that reduce our environmental impact.
            </p>
            <p className="text-xl">
              We're committed to pushing the boundaries of what's possible in home automation, always with the goal of
              making your life simpler, more efficient, and more enjoyable.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <Image
              src="/future-vision.jpg"
              alt="Future of home automation"
              width={500}
              height={300}
              objectFit="cover"
              className="rounded-lg shadow-lg w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

