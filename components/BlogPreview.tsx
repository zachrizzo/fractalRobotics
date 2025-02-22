'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const recentPosts = [
    {
        title: "The Future of Human-Robot Collaboration",
        excerpt: "Exploring how R1's advanced AI enables natural interaction and seamless cooperation with human workers.",
        image: "/robotImages/r1-robot.png",
        date: "Feb 22, 2024",
        readTime: "5 min read",
        category: "AI & Robotics"
    },
    {
        title: "Advancing Manufacturing with Robotic Precision",
        excerpt: "How our robotic solutions are transforming production lines and improving efficiency.",
        image: "/robotImages/image (3).png",
        date: "Feb 20, 2024",
        readTime: "4 min read",
        category: "Industry"
    },
    {
        title: "R1: A New Era in Robotics",
        excerpt: "Deep dive into the technical specifications and capabilities of our flagship robot.",
        image: "/robotImages/r1-robot-2.png",
        date: "Feb 18, 2024",
        readTime: "6 min read",
        category: "Technology"
    }
];

export default function BlogPreview() {
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentPosts.map((post, index) => (
                            <motion.div
                                key={post.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={post.image}
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
                                        <span className="text-sm text-gray-500">{post.date}</span>
                                        <Link
                                            href="/blog"
                                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                                        >
                                            Read More →
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

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
