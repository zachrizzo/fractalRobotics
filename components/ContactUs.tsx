"use client"

import { motion } from "framer-motion"

export default function ContactUs() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-12 text-center text-gray-800"
        >
          Join the Robotics Revolution
        </motion.h2>
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="interest" className="block mb-2 text-sm font-medium text-gray-700">
              Area of Interest
            </label>
            <select
              id="interest"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="">Select an area</option>
              <option value="ai">Artificial Intelligence</option>
              <option value="robotics">Robotics Engineering</option>
              <option value="computer_vision">Computer Vision</option>
              <option value="nlp">Natural Language Processing</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Tell us about your interest in home robotics..."
            ></textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Connect with Us
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}

