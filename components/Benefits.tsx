"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const benefits = [
    {
        title: "Manufacturing & Assembly",
        description: "Enhance production efficiency with precise, tireless robotic assistance in assembly lines and manufacturing processes.",
        icon: (
            <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
        ),
        stats: {
            value: "300%",
            label: "Productivity Increase"
        }
    },
    {
        title: "Warehouse Operations",
        description: "Streamline logistics with autonomous picking, packing, and inventory management capabilities.",
        icon: (
            <svg className="w-12 h-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
        ),
        stats: {
            value: "24/7",
            label: "Operational Uptime"
        }
    },
    {
        title: "Healthcare Support",
        description: "Assist healthcare professionals with patient care, medical supply handling, and facility sanitization.",
        icon: (
            <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
        stats: {
            value: "60%",
            label: "Task Automation"
        }
    },
    {
        title: "Research & Development",
        description: "Accelerate innovation with precise data collection and experiment execution in laboratory settings.",
        icon: (
            <svg className="w-12 h-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
        ),
        stats: {
            value: "99.9%",
            label: "Task Accuracy"
        }
    }
]

export default function Benefits() {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Helping Hands at Work
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Our robots bring AI into the physical world to help with real tasks. They work alongside people to make jobs easier, safer, and more efficient.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                        >
                            <div className="mb-6">{benefit.icon}</div>
                            <h3 className="text-2xl font-semibold mb-3 text-gray-900">{benefit.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">{benefit.description}</p>
                            <div className="border-t border-gray-100 pt-4">
                                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                    {benefit.stats.value}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">{benefit.stats.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-20 rounded-3xl p-1 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                    <div className="bg-white rounded-[1.4rem] p-8 lg:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-5">
                                <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                    Want to See Our Robots in Action?
                                </h3>
                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    Book a live demo to see how our robots can help with your specific needs.
                                </p>
                                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                                    Schedule a Demo
                                </button>
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    {[
                                        { value: "95%", label: "Cost Reduction" },
                                        { value: "2x", label: "Efficiency Gain" },
                                        { value: "24/7", label: "Operation Time" },
                                        { value: "99.9%", label: "Accuracy Rate" }
                                    ].map((stat, index) => (
                                        <motion.div
                                            key={stat.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 1 + (index * 0.1) }}
                                            className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                                        >
                                            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-7 relative">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="relative w-full aspect-[3/4] max-h-[600px]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-purple-50 rounded-3xl opacity-20 blur-xl" />
                                    <Image
                                        src="/robotImages/r1-robot.png"
                                        alt="R1 Robot Technical Specifications"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        quality={100}
                                        priority
                                        className="object-contain relative z-10"
                                        style={{
                                            objectFit: 'contain',
                                            filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.1))'
                                        }}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
