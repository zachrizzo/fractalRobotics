"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { addDoc, collection } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../lib/firebase"
import { motion, AnimatePresence } from "framer-motion"
import { EditorContent, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "next/image"
import { PlusCircle, X, ArrowUp, ArrowDown, Type, ImageIcon, VideoIcon } from "lucide-react"

interface Block {
  id: string
  type: "text" | "image" | "video"
  content: string
  editor?: Editor | null
}

export default function AddBlogPost() {
  const [title, setTitle] = useState("")
  const [blocks, setBlocks] = useState<Block[]>([{ id: "1", type: "text", content: "", editor: null }])
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createEditor = useCallback((content = "") => {
    return new Editor({
      extensions: [StarterKit],
      content: content,
    })
  }, [])

  const handleEditorUpdate = useCallback((index: number, editor: Editor) => {
    const html = editor.getHTML()
    setBlocks((prev) => prev.map((block, i) => (i === index ? { ...block, content: html } : block)))
  }, [])

  useEffect(() => {
    blocks.forEach((block, index) => {
      if (block.type === "text" && block.editor) {
        block.editor.on("update", ({ editor }) => {
          handleEditorUpdate(index, editor)
        })
      }
    })
  }, [blocks, handleEditorUpdate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!db || !storage) {
      setError("Firebase is not initialized")
      setIsLoading(false)
      return
    }

    try {
      const processedBlocks = await Promise.all(
        blocks.map(async (block) => {
          if (block.type === "text") return block

          if ((block.type === "image" || block.type === "video") && storage) {
            const file = await fetch(block.content).then((r) => r.blob())
            const fileRef = ref(storage, `blog-${block.type}s/${Date.now()}-${block.id}`)
            await uploadBytes(fileRef, file)
            const url = await getDownloadURL(fileRef)
            return { ...block, content: url }
          }

          return block
        })
      )

      await addDoc(collection(db, "blogPosts"), {
        title,
        content: processedBlocks.map((block) => block.content).join("\n"),
        createdAt: new Date().toISOString(),
      })

      setTitle("")
      setBlocks([{ id: "1", type: "text", content: "", editor: null }])
      setSuccessMessage("Blog post added successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error adding blog post: ", error)
      setError("Failed to add blog post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const addBlock = (type: "text" | "image" | "video", index: number) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: "",
      editor: type === "text" ? createEditor() : null,
    }
    setBlocks((prev) => [...prev.slice(0, index + 1), newBlock, ...prev.slice(index + 1)])
  }

  const removeBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index))
  }

  const moveBlock = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index > 0) || (direction === "down" && index < blocks.length - 1)) {
      const newIndex = direction === "up" ? index - 1 : index + 1
      setBlocks((prev) => {
        const newBlocks = [...prev]
        const [removed] = newBlocks.splice(index, 1)
        newBlocks.splice(newIndex, 0, removed)
        return newBlocks
      })
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number, type: "image" | "video") => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBlocks((prev) =>
          prev.map((block, i) => (i === index ? { ...block, content: reader.result as string } : block)),
        )
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Blog Post</h2>
      {successMessage && (
        <motion.p
          className="text-green-500 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {successMessage}
        </motion.p>
      )}
      {error && (
        <motion.p
          className="text-red-500 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {error}
        </motion.p>
      )}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <div className="relative">
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="block w-full px-4 py-3 rounded-md border-2 border-gray-300 shadow-sm focus:ring-primary-color focus:border-primary-color transition duration-200 ease-in-out text-gray-900 placeholder-gray-500"
            placeholder="Enter your blog post title"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">Make it catchy and descriptive</p>
      </div>
      <AnimatePresence>
        {blocks.map((block, index) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative border rounded p-4 mb-4"
          >
            {block.type === "text" && (
              <EditorContent
                editor={block.editor || (block.editor = createEditor(block.content))}
                className="prose max-w-full"
              />
            )}
            {block.type === "image" && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index, "image")}
                  className="mb-2"
                />
                {block.content && (
                  <Image
                    src={block.content || "/placeholder.svg"}
                    alt="Blog image"
                    width={300}
                    height={200}
                    className="mt-2"
                  />
                )}
              </div>
            )}
            {block.type === "video" && (
              <div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, index, "video")}
                  className="mb-2"
                />
                {block.content && <video src={block.content} controls className="mt-2 w-full max-w-md" />}
              </div>
            )}
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                type="button"
                onClick={() => moveBlock(index, "up")}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowUp size={20} />
              </button>
              <button
                type="button"
                onClick={() => moveBlock(index, "down")}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowDown size={20} />
              </button>
              <button type="button" onClick={() => removeBlock(index)} className="text-red-500 hover:text-red-700">
                <X size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="flex justify-center space-x-4 my-4">
        <button
          type="button"
          onClick={() => addBlock("text", blocks.length - 1)}
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <PlusCircle size={20} className="mr-1" /> <Type size={20} />
        </button>
        <button
          type="button"
          onClick={() => addBlock("image", blocks.length - 1)}
          className="flex items-center text-green-500 hover:text-green-700"
        >
          <PlusCircle size={20} className="mr-1" /> <ImageIcon size={20} />
        </button>
        <button
          type="button"
          onClick={() => addBlock("video", blocks.length - 1)}
          className="flex items-center text-purple-500 hover:text-purple-700"
        >
          <PlusCircle size={20} className="mr-1" /> <VideoIcon size={20} />
        </button>
      </div>
      <motion.button
        type="submit"
        className="w-full bg-primary-color text-white py-2 px-4 rounded hover:bg-secondary-color transition duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
      >
        {isLoading ? "Adding Blog Post..." : "Add Blog Post"}
      </motion.button>
    </motion.form>
  )
}

