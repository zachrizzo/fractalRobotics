import { notFound } from "next/navigation"
import Image from "next/image"

interface BlogPost {
  id: string
  title: string
  content: string
  imageUrl?: string
  videoUrl?: string
  createdAt: string
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Home Automation",
    content: "Lorem ipsum dolor sit amet...",
    imageUrl: "/blog-post-1.jpg",
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    title: "How AI is Changing Our Daily Lives",
    content: "Consectetur adipiscing elit...",
    imageUrl: "/blog-post-2.jpg",
    createdAt: "2023-05-10",
  },
  {
    id: "3",
    title: "Sustainable Living with Smart Homes",
    content: "Sed do eiusmod tempor incididunt...",
    imageUrl: "/blog-post-3.jpg",
    createdAt: "2023-05-05",
  },
  // Add more blog posts here
]

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((post) => post.title.toLowerCase().replace(/ /g, "-") === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-3xl mx-auto">
        {post.imageUrl && (
          <Image
            src={post.imageUrl || "/placeholder.svg"}
            alt={post.title}
            width={800}
            height={400}
            objectFit="cover"
            className="rounded-lg mb-8"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-8">{new Date(post.createdAt).toLocaleDateString()}</p>
        {post.videoUrl && (
          <div className="mb-8">
            <video src={post.videoUrl} controls className="w-full h-auto rounded-lg" />
          </div>
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  )
}

