"use client"

import { motion } from "framer-motion"

export default function PracticalApplications() {
    return (
        <section id="applications" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl font-bold mb-12 text-center text-gradient"
                >
                    Practical Applications & Universal Design
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4">Warehouse & Industrial Applications</h3>
                            <div className="space-y-4">
                                <p className="text-gray-700">
                                    Our humanoid robots are specifically designed to seamlessly integrate into existing warehouse environments,
                                    utilizing their human-like form factor to operate standard equipment, navigate narrow aisles, and handle
                                    diverse objects.
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>Operation of forklifts and material handling equipment</li>
                                    <li>Package sorting and inventory management</li>
                                    <li>Quality control and inspection tasks</li>
                                    <li>Collaborative work with human employees</li>
                                    <li>Adaptable to different warehouse layouts without modification</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4">Manufacturing & Assembly</h3>
                            <div className="space-y-4">
                                <p className="text-gray-700">
                                    The versatility of our humanoid design enables seamless integration into existing manufacturing facilities,
                                    offering unprecedented flexibility in assembly line operations.
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>Complex assembly tasks requiring human-like dexterity</li>
                                    <li>Tool handling and equipment operation</li>
                                    <li>Quality inspection and testing</li>
                                    <li>Flexible production line adaptation</li>
                                    <li>Safe human-robot collaboration in shared workspaces</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="space-y-8"
                    >
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4">Home & Personal Assistance</h3>
                            <div className="space-y-4">
                                <p className="text-gray-700">
                                    The humanoid form factor is ideal for home environments, enabling natural interaction with household
                                    items and appliances designed for human use.
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>Household chores and cleaning tasks</li>
                                    <li>Meal preparation and kitchen assistance</li>
                                    <li>Elderly care and mobility support</li>
                                    <li>Home maintenance and repairs</li>
                                    <li>Pet care and plant maintenance</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4">Universal Design Benefits</h3>
                            <div className="space-y-4">
                                <p className="text-gray-700">
                                    Our commitment to universal design principles ensures our robots can operate effectively in human-centric
                                    environments without requiring costly modifications or special accommodations.
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>Compatible with existing infrastructure</li>
                                    <li>Natural navigation of stairs and doorways</li>
                                    <li>Intuitive human-robot interaction</li>
                                    <li>Reduced implementation costs</li>
                                    <li>Seamless integration into daily operations</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
