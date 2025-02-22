"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getLatestBlogPosts, type BlogPost } from "../utils/firebase"

export default function LatestBlog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const posts = await getLatestBlogPosts(3)
        setBlogPosts(posts)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Latest from Our Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Latest from Our Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogPostCard
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.excerpt}
              imageUrl={post.imageUrl}
              readTime={post.readTime}
              category={post.category}
            />
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
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  readTime: string;
  category: string;
}

function BlogPostCard({ id, title, excerpt, imageUrl, readTime, category }: BlogPostCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-blue-500">{category}</span>
          <span className="text-sm text-gray-500">{readTime}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <Link href={`/blog/${id}`} className="text-blue-500 hover:text-blue-600">
          Read more
        </Link>
      </div>
    </motion.div>
  )
}

