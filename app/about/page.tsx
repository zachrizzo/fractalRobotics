import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">About Fractal Robotics</h1>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
        <div className="md:w-1/2">
          <Image
            src="/about-us.jpg"
            alt="Fractal Robotics team"
            width={500}
            height={300}
            objectFit="cover"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2">
          <p className="text-xl mb-4">
            At Fractal Robotics, we're revolutionizing home automation with intelligent robots. Our cutting-edge
            technology combines advanced AI with precision engineering to create robots that simplify your daily life.
          </p>
          <p className="text-xl mb-4">
            Founded in 2020, our team of passionate engineers and designers is dedicated to creating innovative
            solutions that make your home smarter, more efficient, and more comfortable.
          </p>
          <p className="text-xl">
            Our mission is to give you more time for what matters most by automating routine tasks and enhancing your
            living space with intuitive, AI-powered devices.
          </p>
        </div>
      </div>
    </div>
  )
}

