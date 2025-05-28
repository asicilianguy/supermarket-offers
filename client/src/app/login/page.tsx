"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useLoginMutation } from "@/redux/features/user/userApiSlice"
import { LogIn, Lock } from "lucide-react"
import Cookies from "js-cookie"

export default function Login() {
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()

  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  })

  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Format phone number to ensure it has the +39 prefix
      let formattedPhoneNumber = formData.phoneNumber
      if (!formattedPhoneNumber.startsWith("+39")) {
        formattedPhoneNumber = "+39" + formattedPhoneNumber.replace(/^0/, "")
      }

      const result = await login({
        phoneNumber: formattedPhoneNumber,
        password: formData.password,
      }).unwrap()

      // Store token in both localStorage and cookie
      localStorage.setItem("token", result.token)
      Cookies.set("token", result.token, { expires: 7 }) // expires in 7 days

      console.log("Login successful, token saved:", result.token)

      // Use window.location for a hard redirect
      window.location.href = "/dashboard"
    } catch (err: any) {
      setError(err.data?.message || "Credenziali non valide")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-dark-50">
      <motion.div
        className="w-full max-w-md space-y-8 card-stacked"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-card">
          <div>
            <div className="flex justify-center">
              <motion.div
                className="bg-primary-100 p-3 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <LogIn className="h-8 w-8 text-primary-600" />
              </motion.div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Accedi al tuo account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Oppure{" "}
              <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                registrati se non hai un account
              </Link>
            </p>
          </div>

          {error && (
            <motion.div
              className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative"
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md">
              <div>
                <label htmlFor="phoneNumber" className="input-label">
                  Numero di telefono
                </label>
                <div className="mt-1 flex rounded-xl shadow-sm">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                    +39
                  </span>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    className="block w-full flex-1 rounded-none rounded-r-xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all duration-200"
                    placeholder="3401234567"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="input-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="input"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-primary-600 to-secondary-600 py-3 px-4 text-sm font-medium text-white hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 shadow-md hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-primary-300 group-hover:text-primary-200" />
                </span>
                {isLoading ? "Accesso in corso..." : "Accedi"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
