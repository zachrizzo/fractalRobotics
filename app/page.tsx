import Hero from "@/components/Hero"
import Mission from "@/components/Mission"
import Benefits from "@/components/Benefits"
import Technologies from "@/components/Technologies"
import Roadmap from "@/components/Roadmap"
import ContactUs from "../components/ContactUs"

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <Hero />
      <Mission />
      <Benefits />
      <Technologies />
      <Roadmap />
      <ContactUs />
    </main>
  )
}

