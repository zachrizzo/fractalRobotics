import Hero from "../components/Hero"
import AboutUs from "../components/AboutUs"
import Technologies from "../components/Technologies"
import Roadmap from "../components/Roadmap"
import ContactUs from "../components/ContactUs"

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <Hero />
      <AboutUs />
      <Technologies />
      <Roadmap />
      <ContactUs />
    </main>
  )
}

