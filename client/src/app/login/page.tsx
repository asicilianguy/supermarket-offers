"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useLoginMutation } from "@/redux/features/user/userApiSlice"

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

      // Store token in localStorage
      localStorage.setItem("token", result.token)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.data?.message || "Credenziali non valide")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <motion.div
        className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Accedi al tuo account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Oppure{" "}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
              registrati se non hai un account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Numero di telefono
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                  +39
                </span>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  placeholder="3401234567"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-primary-300"
            >
              {isLoading ? "Accesso in corso..." : "Accedi"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
