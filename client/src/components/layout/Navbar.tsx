"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useGetUserProfileQuery } from "@/redux/features/user/userApiSlice"

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { data: user } = useGetUserProfileQuery(undefined, {
    skip: !isLoggedIn,
  })

  useEffect(() => {
    // Check if user is logged in
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    setIsLoggedIn(!!token)
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
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
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
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {user.name.split(" ")[0]}
                </div>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={
                  pathname === link.href ? "nav-link nav-link-active block" : "nav-link nav-link-inactive block"
                }
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}

            {isLoggedIn && user && (
              <div className="px-3 py-2 text-sm font-medium text-gray-700">Benvenuto, {user.name.split(" ")[0]}</div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
