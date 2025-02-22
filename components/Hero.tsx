'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-blue-50 to-purple-50 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-blue-50 to-purple-50 rounded-full opacity-20 blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="inline-block p-2 px-4 bg-blue-50 rounded-full mb-6"
                        >
                            <span className="text-blue-600 font-medium">We Give AI a Physical Form</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                Fractal Robotics
                            </span>
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-8">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                AI That Can Move and Help
                            </span>
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Meet R1, a robot that combines AI with a physical body. It can see, move, and help with real tasks - from picking up heavy boxes to organizing spaces. Think of it as AI that can actually reach out and lend a hand.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Learn More
                            </button>
                            <button className="px-8 py-3 border-2 border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-0.5">
                                Watch Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* Robot Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full aspect-[3/4] max-h-[700px]"
                    >
                        <div className="relative w-full h-full">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-purple-50 rounded-3xl opacity-30 blur-xl" />
                            <Image
                                src="/robotImages/r1-robot-2.png"
                                alt="Fractal Robotics R1"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                quality={100}
                                priority
                                className="object-contain relative z-10"
                                style={{ objectFit: 'contain', transform: 'scale(1.1)' }}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                    {[
                        {
                            title: 'Advanced AI',
                            description: 'Powered by cutting-edge artificial intelligence',
                            icon: (
                                <svg className="w-8 h-8 mb-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            )
                        },
                        {
                            title: 'Human-Centric',
                            description: 'Designed for natural interaction with humans',
                            icon: (
                                <svg className="w-8 h-8 mb-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            )
                        },
                        {
                            title: 'Versatile',
                            description: 'Adaptable to various environments and tasks',
                            icon: (
                                <svg className="w-8 h-8 mb-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                </svg>
                            )
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 * index }}
                            className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {feature.icon}
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
