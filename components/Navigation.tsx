"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    // { label: "Solutions", href: "/solutions" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/robotImages/r1-robot.png"
              alt="Fractal Robotics"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Fractal Robotics
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-around">
              <span
                className={`block h-0.5 w-full bg-gray-600 transform transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''
                  }`}
              />
              <span
                className={`block h-0.5 w-full bg-gray-600 transition-all duration-300 ${isOpen ? 'opacity-0' : ''
                  }`}
              />
              <span
                className={`block h-0.5 w-full bg-gray-600 transform transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          variants={{
            open: { opacity: 1, height: 'auto' },
            closed: { opacity: 0, height: 0 }
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  )
}

export default Navigation

