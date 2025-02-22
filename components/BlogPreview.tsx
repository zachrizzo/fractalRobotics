'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getLatestBlogPosts, type BlogPost } from '@/lib/firebase';

export default function BlogPreview() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const fetchedPosts = await getLatestBlogPosts(3);
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold mb-6">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                Latest Insights
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Stay updated with our latest developments, industry insights, and technological breakthroughs.
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.2 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                                >
                                    <div className="animate-pulse">
                                        <div className="h-48 bg-gray-200 w-full"></div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                                                <div className="h-6 w-20 bg-gray-200 rounded"></div>
                                            </div>
                                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.2 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                                >
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={post.imageUrl || "/placeholder.svg"}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                {post.category}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {post.readTime}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3 text-gray-900">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </span>
                                            <Link
                                                href={`/blog/${post.id}`}
                                                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                                            >
                                                Read More →
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/blog"
                            className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 font-semibold"
                        >
                            View All Posts
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
