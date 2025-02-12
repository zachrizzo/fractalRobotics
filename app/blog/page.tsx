"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { auth, db } from "../../lib/firebase"
import AddBlogPost from "../../components/AddBlogPost"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface BlogPost {
  id: string
  title: string
  content: string
  imageUrl?: string
  videoUrl?: string
  createdAt: string
}

export default function BlogPage() {
  const [user, setUser] = useState(null)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"))
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogPost[]
      setBlogPosts(posts)
    })

    return () => {
      unsubscribeAuth()
      unsubscribePosts()
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-8 text-center text-gradient"
      >
        Fractal Robotics Blog
      </motion.h1>
      {user && <AddBlogPost />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover-scale"
          >
            {post.imageUrl ? (
              <Image
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                width={400}
                height={200}
                objectFit="cover"
                className="w-full h-48 object-cover"
              />
            ) : (
              <Image
                src="/placeholder.svg"
                alt={post.title}
                width={400}
                height={200}
                objectFit="cover"
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{new Date(post.createdAt).toLocaleDateString()}</p>
              <div
                className="text-gray-600 mb-4 flex-grow"
                dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + "..." }}
              />
              {post.videoUrl && (
                <div className="mb-4">
                  <video src={post.videoUrl} controls className="w-full h-auto" />
                </div>
              )}
              <Link
                href={`/blog/${post.id}`}
                className="text-primary-color hover:text-secondary-color self-start transition-colors duration-300"
              >
                Read more
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

