import React from 'react'
import Image from "next/image"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 z-10" />
        <Image
          src="/robot-banner.jpg"
          alt="Fractal Robotics Vision"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white max-w-4xl">
            Building the Future of Robotics
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Vision Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Our Vision
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Founded in 2024 by Colin Hertzer and Zach Rizzo, Fractal Robotics emerged from a shared vision: to revolutionize
            the way humans interact with machines. We believe that robots should not just be tools, but intelligent companions
            that enhance our daily lives and push the boundaries of what's possible.
          </p>
          <p className="text-xl text-gray-700 leading-relaxed">
            Our mission is bold yet clear - to develop the world's most advanced humanoid robots that can adapt, learn,
            and seamlessly integrate into human environments. We're not just building robots; we're shaping the future
            of human-robot collaboration.
          </p>
        </div>

        {/* Founders Section */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/colin-profile.jpg"
              alt="Colin Hertzer"
              width={200}
              height={200}
              className="rounded-full mx-auto mb-6"
            />
            <h3 className="text-2xl font-bold mb-4 text-center">Colin Hertzer</h3>
            <p className="text-gray-600 leading-relaxed">
              As our hardware visionary, Colin brings his exceptional mechanical engineering expertise to life
              through innovative robot designs. His passion for creating robust, efficient, and elegant mechanical
              solutions drives our hardware development forward, ensuring our robots are both capable and reliable.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/zach-profile.jpg"
              alt="Zach Rizzo"
              width={200}
              height={200}
              className="rounded-full mx-auto mb-6"
            />
            <h3 className="text-2xl font-bold mb-4 text-center">Zach Rizzo</h3>
            <p className="text-gray-600 leading-relaxed">
              Leading our software development, Zach combines cutting-edge AI and robotics algorithms to create
              intelligent systems that can understand, learn, and adapt. His expertise in machine learning and
              computer vision enables our robots to perceive and interact with the world in unprecedented ways.
            </p>
          </div>
        </div>

        {/* Technology Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Our Technology
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Advanced AI</h3>
              <p className="text-gray-600">
                Cutting-edge machine learning algorithms enabling natural interaction and adaptive behavior.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Precision Engineering</h3>
              <p className="text-gray-600">
                State-of-the-art hardware design combining durability with sophisticated mechanics.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Human-Centric Design</h3>
              <p className="text-gray-600">
                Intuitive interfaces and natural movement patterns for seamless human-robot interaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

