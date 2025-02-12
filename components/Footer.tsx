import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Fractal Robotics</h3>
            <p className="text-gray-600">Revolutionizing your home with intelligent automation</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-gray-600 hover:text-blue-500">
                  Our Solutions
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-blue-500">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-600 hover:text-blue-500">
                  Shop
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Contact</h4>
            <p className="text-gray-600">Email: info@fractalrobotics.com</p>
            <p className="text-gray-600">Phone: (123) 456-7890</p>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-500">
                Facebook
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500">
                Twitter
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500">
                Instagram
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">&copy; 2023 Fractal Robotics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

