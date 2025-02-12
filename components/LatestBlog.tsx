"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    title: "The Future of Home Automation",
    excerpt: "Explore the latest trends in smart home technology...",
    image: "/blog-post-1.jpg",
  },
  {
    id: 2,
    title: "How AI is Changing Our Daily Lives",
    excerpt: "Artificial Intelligence is revolutionizing the way we live...",
    image: "/blog-post-2.jpg",
  },
  {
    id: 3,
    title: "Sustainable Living with Smart Homes",
    excerpt: "Discover how smart home technology can help reduce your carbon footprint...",
    image: "/blog-post-3.jpg",
  },
]

export default function LatestBlog() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Latest from Our Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogPostCard key={post.id} title={post.title} excerpt={post.excerpt} image={post.image} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/blog" className="text-blue-500 hover:text-blue-600 text-lg font-semibold">
            View all blog posts
          </Link>
        </div>
      </div>
    </section>
  )
}

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  image: string;
}

function BlogPostCard({ title, excerpt, image }: BlogPostCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Image src={image || "/placeholder.svg"} alt={title} width={400} height={200} objectFit="cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <Link href={`/blog/${title.toLowerCase().replace(/ /g, "-")}`} className="text-blue-500 hover:text-blue-600">
          Read more
        </Link>
      </div>
    </motion.div>
  )
}

