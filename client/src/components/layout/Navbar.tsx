"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, ShoppingCart, Home, Tag, Search, User, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Cookies from "js-cookie"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    setIsLoggedIn(!!token)

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch user data only if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem("token")
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
            headers: {
              "x-auth-token": token || "",
            },
          })
          if (response.ok) {
            const userData = await response.json()
            setUserName(userData.name)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
    }

    fetchUserData()
  }, [isLoggedIn])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token")

    // Clear token from cookies - assicuriamoci di rimuovere il cookie correttamente
    // Rimuovi con opzioni specifiche per garantire che venga eliminato correttamente
    Cookies.remove("token", { path: "/" })

    // Forza un hard refresh verso la pagina di login
    window.location.href = "/login"
  }

  const navLinks = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Offerte", href: "/offers", icon: <Tag className="h-5 w-5" /> },
    { name: "Cerca", href: "/search", icon: <Search className="h-5 w-5" /> },
    ...(isLoggedIn
      ? [
          { name: "Dashboard", href: "/dashboard", icon: <ShoppingCart className="h-5 w-5" /> },
          { name: "Profilo", href: "/profile", icon: <User className="h-5 w-5" /> },
        ]
      : [
          { name: "Accedi", href: "/login", icon: <LogOut className="h-5 w-5" /> },
          { name: "Registrati", href: "/register", icon: <User className="h-5 w-5" /> },
        ]),
  ]

  // Varianti per animazioni
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const mobileItemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="mobile-container">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex-shrink-0 flex items-center" onClick={closeMenu}>
            <ShoppingCart className="h-6 w-6 mr-2 text-primary-500" />
            <span className="text-primary-600 font-bold text-xl">RisparmiApp</span>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={pathname === link.href ? "nav-link nav-link-active" : "nav-link nav-link-inactive"}
              >
                {link.name}
              </Link>
            ))}

            {isLoggedIn && userName && (
              <div className="ml-4 flex items-center">
                <div className="bg-primary-100 text-primary-800 px-4 py-2 rounded-xl text-sm font-medium">
                  {userName.split(" ")[0]}
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-full"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <motion.button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none"
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-white z-40 pt-16"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <div className="px-4 pt-2 pb-4 space-y-1 flex flex-col h-full">
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={mobileItemVariants}>
                  <Link
                    href={link.href}
                    className={`flex items-center p-4 rounded-xl my-1 ${
                      pathname === link.href
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    }`}
                    onClick={closeMenu}
                  >
                    <span className="mr-3">{link.icon}</span>
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </motion.div>
              ))}

              {isLoggedIn && userName && (
                <motion.div className="mt-auto border-t border-gray-100 pt-4 pb-8" variants={mobileItemVariants}>
                  <div className="flex items-center p-4 bg-primary-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{userName}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="ml-auto p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-full"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
