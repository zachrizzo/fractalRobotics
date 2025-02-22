"use client"

import { motion } from "framer-motion"
import BlogPreview from './BlogPreview'

export default function Roadmap() {
  return (
    <>
      <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
          <motion.h2
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
              className="text-5xl font-bold mb-8"
          >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Our Development Roadmap
              </span>
          </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl mb-12 text-gray-600"
            >
              Follow our journey as we continue to innovate and develop cutting-edge robotics solutions.
            </motion.p>
                      </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-600 to-purple-600" />

              {/* Timeline Items */}
              {[
                {
                  year: "2024 Q1",
                  title: "R1 Beta Launch",
                  description: "Initial release of our flagship humanoid robot with basic functionality and safety features.",
                  status: "Completed"
                },
                {
                  year: "2024 Q2",
                  title: "Advanced AI Integration",
                  description: "Implementation of enhanced learning algorithms and natural interaction capabilities.",
                  status: "In Progress"
                },
                {
                  year: "2024 Q3",
                  title: "Industry-Specific Solutions",
                  description: "Development of specialized modules for manufacturing, healthcare, and research sectors.",
                  status: "Planned"
                },
                {
                  year: "2024 Q4",
                  title: "Global Deployment",
                  description: "Expansion of operations and establishment of worldwide support infrastructure.",
                  status: "Planned"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 ${index % 2 === 0 ? 'md:text-right' : 'md:flex-row-reverse'
                    }`}
                >
                  <div className={`md:text-right ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <span className="text-sm font-semibold text-blue-600">{item.year}</span>
                      <h3 className="text-xl font-semibold mt-2 mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className={`flex items-center ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                    }`}>
                    <div className="relative flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                      <div className="absolute w-4 h-4 bg-white rounded-full" />
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm ${item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                          }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <BlogPreview />
    </>
  )
}

