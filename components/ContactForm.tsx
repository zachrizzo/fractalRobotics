import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { db } from '../app/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    })
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')

        try {
            await addDoc(collection(db, 'contacts'), {
                ...formData,
                timestamp: serverTimestamp(),
            })
            setStatus('success')
            setFormData({ name: '', email: '', message: '' })
            setTimeout(() => setStatus('idle'), 3000)
        } catch (error) {
            console.error('Error submitting form:', error)
            setStatus('error')
            setTimeout(() => setStatus('idle'), 3000)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <section id="contact" className="py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Get in Touch
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600">
                        Have questions about our robotics solutions? We'd love to hear from you.
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8"
                >
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Your name"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Your message..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className={`w-full py-4 px-6 rounded-lg text-white font-semibold ${status === 'submitting'
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all'
                            }`}
                    >
                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    </button>

                    {status === 'success' && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 text-green-600 text-center"
                        >
                            Thank you! We'll get back to you soon.
                        </motion.p>
                    )}

                    {status === 'error' && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 text-red-600 text-center"
                        >
                            Oops! Something went wrong. Please try again.
                        </motion.p>
                    )}
                </motion.form>
            </div>
        </section>
    )
}
