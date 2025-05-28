"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRegisterMutation } from "@/redux/features/user/userApiSlice"
import SupermarketSelector from "@/components/auth/SupermarketSelector"
import { SUPERMARKETS } from "@/constants/supermarkets"
import { User, ShieldCheck } from "lucide-react"

export default function Register() {
  const router = useRouter()
  const [register, { isLoading }] = useRegisterMutation()

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    frequentedSupermarkets: [] as string[],
  })

  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSupermarketChange = (supermarkets: string[]) => {
    setFormData({
      ...formData,
      frequentedSupermarkets: supermarkets,
    })
  }

  const handleSelectAll = () => {
    setFormData({
      ...formData,
      frequentedSupermarkets: [...SUPERMARKETS],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Le password non coincidono")
      return
    }

    if (formData.frequentedSupermarkets.length === 0) {
      setError("Seleziona almeno un supermercato")
      return
    }

    try {
      // Format phone number to ensure it has the +39 prefix
      let formattedPhoneNumber = formData.phoneNumber
      if (!formattedPhoneNumber.startsWith("+39")) {
        formattedPhoneNumber = "+39" + formattedPhoneNumber.replace(/^0/, "")
      }

      const result = await register({
        name: formData.name,
        phoneNumber: formattedPhoneNumber,
        password: formData.password,
        frequentedSupermarkets: formData.frequentedSupermarkets,
      }).unwrap()

      // Store token in localStorage
      localStorage.setItem("token", result.token)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.data?.message || "Errore durante la registrazione")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <motion.div
        className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="flex justify-center">
            <motion.div
              className="bg-primary-100 p-3 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <User className="h-8 w-8 text-primary-600" />
            </motion.div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Crea il tuo account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Oppure{" "}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              accedi se hai già un account
            </Link>
          </p>
        </div>

        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative"
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
              <label htmlFor="name" className="input-label">
                Nome completo
              </label>
              <div className="input-wrapper">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input"
                  placeholder="Mario Rossi"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

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
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="input-label">
                Conferma password
              </label>
              <div className="input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Supermercati frequentati</label>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Seleziona tutti
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Seleziona i supermercati che frequenti abitualmente per ricevere offerte personalizzate.
              </p>
              <SupermarketSelector
                selectedSupermarkets={formData.frequentedSupermarkets}
                onChange={handleSupermarketChange}
              />
            </div>
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-xl border border-transparent bg-primary-600 py-3 px-4 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-primary-300 shadow-md hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <ShieldCheck className="h-5 w-5 text-primary-400 group-hover:text-primary-300" />
              </span>
              {isLoading ? "Registrazione in corso..." : "Registrati"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
