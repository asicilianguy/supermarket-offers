"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useRegisterMutation } from "@/redux/features/user/userApiSlice"
import SupermarketSelector from "@/components/auth/SupermarketSelector"
import { SUPERMARKETS } from "@/constants/supermarkets"
import { User, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react"
import Cookies from "js-cookie"
import { showToast } from "@/components/ui/Toast"

export default function Register() {
  const router = useRouter()
  const [register, { isLoading }] = useRegisterMutation()
  const [step, setStep] = useState(1)
  const totalSteps = 2

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
      frequentedSupermarkets: SUPERMARKETS.map(supermarket => supermarket.value),
    })
    showToast.info("Tutti i supermercati selezionati")
  }

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      // Validate first step
      if (!formData.name || !formData.phoneNumber || !formData.password || !formData.confirmPassword) {
        setError("Compila tutti i campi per continuare")
        showToast.error("Compila tutti i campi per continuare")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Le password non coincidono")
        showToast.error("Le password non coincidono")
        return
      }

      if (formData.password.length < 6) {
        setError("La password deve contenere almeno 6 caratteri")
        showToast.error("La password deve contenere almeno 6 caratteri")
        return
      }

      setError("")
      setStep(2)
      showToast.info("Ora seleziona i tuoi supermercati preferiti")
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (formData.frequentedSupermarkets.length === 0) {
      setError("Seleziona almeno un supermercato")
      showToast.error("Seleziona almeno un supermercato")
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

      // Store token in both localStorage and cookie
      localStorage.setItem("token", result.token)
      Cookies.set("token", result.token, { expires: 7 }) // expires in 7 days

      showToast.success("Registrazione completata con successo!")

      // Use window.location for a hard redirect
      window.location.href = "/dashboard"
    } catch (err: any) {
      const errorMessage = err.data?.message || "Errore durante la registrazione"
      setError(errorMessage)
      showToast.error(errorMessage)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-6 px-4 sm:py-12 bg-dark-50">
      <motion.div
        className="w-full max-w-md card-stacked"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-card">
          <div className="mb-6">
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
            <h2 className="mt-4 text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              {step === 1 ? "Crea il tuo account" : "Scegli i tuoi supermercati"}
            </h2>

            {step === 1 && (
              <p className="mt-2 text-center text-sm text-gray-600">
                Oppure{" "}
                <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  accedi se hai già un account
                </Link>
              </p>
            )}

            {/* Progress indicator */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-16 mx-1 rounded-full ${
                    i + 1 <= step ? "bg-primary-500" : "bg-gray-200"
                  } transition-all duration-300`}
                />
              ))}
            </div>
          </div>

          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative mb-6"
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}

          <form onSubmit={step === totalSteps ? handleSubmit : nextStep}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
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
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Supermercati frequentati</label>
                      <motion.button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-sm text-primary-600 hover:text-primary-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Seleziona tutti
                      </motion.button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Seleziona i supermercati che frequenti abitualmente per ricevere offerte personalizzate.
                    </p>
                    <SupermarketSelector
                      selectedSupermarkets={formData.frequentedSupermarkets}
                      onChange={handleSupermarketChange}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Indietro
                </motion.button>
              ) : (
                <div></div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                className={`flex items-center justify-center px-4 py-2 rounded-xl border border-transparent text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 ${
                  step === totalSteps
                    ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700"
                    : "bg-gradient-to-r from-primary-600 to-accent-500 text-white hover:from-primary-700 hover:to-accent-600"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {step === totalSteps ? (
                  isLoading ? (
                    "Registrazione..."
                  ) : (
                    <>
                      Registrati
                      <ShieldCheck className="h-4 w-4 ml-1" />
                    </>
                  )
                ) : (
                  <>
                    Avanti
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
