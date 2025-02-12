"use client"

import { motion } from "framer-motion"

const technologies = [
  { id: 1, title: "AI-Powered Robotics", description: "Intelligent machines that learn and adapt" },
  { id: 2, title: "Swarm Intelligence", description: "Coordinated multi-robot systems" },
  { id: 3, title: "Human-Robot Collaboration", description: "Seamless integration of humans and robots" },
  { id: 4, title: "Autonomous Navigation", description: "Advanced pathfinding and obstacle avoidance" },
]

export default function OurTechnologies() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Our Technologies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {technologies.map((tech) => (
            <TechCard key={tech.id} title={tech.title} description={tech.description} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface TechCardProps {
  title: string;
  description: string;
}

function TechCard({ title, description }: TechCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer"
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

