"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const merchItems = [
  { id: 1, name: "Fractal Robotics T-Shirt", price: 24.99, image: "/merch-tshirt.jpg" },
  { id: 2, name: "Smart Home Mug", price: 14.99, image: "/merch-mug.jpg" },
  { id: 3, name: "Robotics Enthusiast Cap", price: 19.99, image: "/merch-cap.jpg" },
]

interface MerchCardProps {
  name: string;
  price: number;
  image: string;
}

function MerchCard({ name, price, image }: MerchCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Image
        src={image || "/placeholder.svg"}
        alt={name}
        width={300}
        height={300}
        style={{ objectFit: "cover" }}
        className="w-full h-[300px]"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{name}</h3>
        <p className="text-gray-600 mb-4">${price.toFixed(2)}</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}

export default function FeaturedMerch() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Featured Merchandise</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {merchItems.map((item) => (
            <MerchCard key={item.id} name={item.name} price={item.price} image={item.image} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Visit Our Shop
          </Link>
        </div>
      </div>
    </section>
  )
}

