import Image from "next/image"
import Link from "next/link"

const solutions = [
  { id: 1, title: "CleanBot", description: "AI-powered vacuum and mopping robot", image: "/cleanbot.jpg" },
  { id: 2, title: "GardenMate", description: "Automated plant care and watering system", image: "/gardenmate.jpg" },
  {
    id: 3,
    title: "SecuritySentry",
    description: "Intelligent home security and monitoring",
    image: "/securitysentry.jpg",
  },
  {
    id: 4,
    title: "KitchenAssist",
    description: "Smart kitchen helper for meal prep and cleanup",
    image: "/kitchenassist.jpg",
  },
]

export default function SolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-center">Our Home Solutions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {solutions.map((solution) => (
          <div key={solution.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <Image
              src={solution.image || "/placeholder.svg"}
              alt={solution.title}
              width={600}
              height={400}
              objectFit="cover"
            />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">{solution.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{solution.description}</p>
              <Link
                href={`/solutions/${solution.title.toLowerCase()}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 text-center"
              >
                Learn more
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

