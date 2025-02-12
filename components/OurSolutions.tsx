"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const solutions = [
  {
    id: 1,
    title: "CleanBot",
    description: "AI-powered vacuum and mopping robot that learns your home's layout for efficient cleaning.",
    image: "/cleanbot.jpg",
  },
  {
    id: 2,
    title: "GardenMate",
    description: "Automated plant care and watering system that ensures your indoor and outdoor plants thrive.",
    image: "/gardenmate.jpg",
  },
  {
    id: 3,
    title: "SecuritySentry",
    description: "Intelligent home security and monitoring system with facial recognition and anomaly detection.",
    image: "/securitysentry.jpg",
  },
  {
    id: 4,
    title: "KitchenAssist",
    description: "Smart kitchen helper for meal prep, inventory management, and automated grocery ordering.",
    image: "/kitchenassist.jpg",
  },
]

export default function OurSolutions() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Our Home Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution) => (
            <SolutionCard key={solution.id} {...solution} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface SolutionCardProps {
  title: string;
  description: string;
  image: string;
}

function SolutionCard({ title, description, image }: SolutionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl"
    >
      <Image src={image || "/placeholder.svg"} alt={title} width={600} height={400} objectFit="cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        <Link
          href={`/solutions/${title.toLowerCase()}`}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 text-center"
        >
          Learn more
        </Link>
      </div>
    </motion.div>
  )
}

