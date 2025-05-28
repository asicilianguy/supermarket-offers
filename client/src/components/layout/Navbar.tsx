"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingCart } from "lucide-react"
import { useGetUserProfileQuery } from "@/redux/features/user/userApiSlice"

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { data: user } = useGetUserProfileQuery(undefined, {
    skip: !isLoggedIn,
  })

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

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Offerte", href: "/offers" },
    { name: "Cerca", href: "/search" },
    ...(isLoggedIn
      ? [
          { name: "Dashboard", href: "/dashboard" },
          { name: "Profilo", href: "/profile" },
        ]
      : [
          { name: "Accedi", href: "/login" },
          { name: "Registrati", href: "/register" },
        ]),
  ]

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2 text-primary-500" />
              <span className="text-blue-600 font-bold text-xl">RisparmiApp</span>
            </Link>
          </div>

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

            {isLoggedIn && user && (
              <div className="ml-4 flex items-center">
                <div className="bg-primary-100 text-primary-800 px-4 py-2 rounded-xl text-sm font-medium">
                  {user.name.split(" ")[0]}
                </div>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg rounded-b-2xl">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={
                  pathname === link.href
                    ? "nav-link nav-link-active block my-1"
                    : "nav-link nav-link-inactive block my-1"
                }
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}

            {isLoggedIn && user && (
              <div className="px-4 py-2 text-sm font-medium text-gray-700 my-2">
                Benvenuto, {user.name.split(" ")[0]}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
