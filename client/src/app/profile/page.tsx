"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useGetUserProfileQuery, useUpdateFrequentedSupermarketsMutation } from "@/redux/features/user/userApiSlice"
import SupermarketSelector from "@/components/auth/SupermarketSelector"
import { SUPERMARKETS } from "@/constants/supermarkets"

export default function Profile() {
  const router = useRouter()
  const { data: user, isLoading, isError } = useGetUserProfileQuery()
  const [updateSupermarkets, { isLoading: isUpdating }] = useUpdateFrequentedSupermarketsMutation()

  const [selectedSupermarkets, setSelectedSupermarkets] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }

    // Set selected supermarkets when user data is loaded
    if (user) {
      setSelectedSupermarkets(user.frequentedSupermarkets)
    }
  }, [user, router])

  const handleSupermarketChange = (supermarkets: string[]) => {
    setSelectedSupermarkets(supermarkets)
  }

  const handleSelectAll = () => {
    setSelectedSupermarkets([...SUPERMARKETS])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    if (selectedSupermarkets.length === 0) {
      setError("Seleziona almeno un supermercato")
      return
    }

    try {
      await updateSupermarkets({ frequentedSupermarkets: selectedSupermarkets }).unwrap()
      setSuccessMessage("Supermercati aggiornati con successo")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (err: any) {
      setError(err.data?.message || "Errore durante l'aggiornamento")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (isError) {
    router.push("/login")
    return null
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        className="bg-white rounded-xl shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">Il tuo profilo</h1>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Informazioni personali</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="mb-2">
                <span className="font-medium">Nome:</span> {user.name}
              </p>
              <p>
                <span className="font-medium">Numero di telefono:</span> {user.phoneNumber}
              </p>
            </div>
          </div>

          {successMessage && (
            <div
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-6"
              role="alert"
            >
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Supermercati frequentati</h2>
              <p className="text-sm text-gray-600 mb-4">
                Seleziona i supermercati che frequenti abitualmente per ricevere offerte personalizzate.
              </p>

              <button
                type="button"
                onClick={handleSelectAll}
                className="mb-4 text-sm text-primary-600 hover:text-primary-500"
              >
                Seleziona tutti
              </button>

              <SupermarketSelector selectedSupermarkets={selectedSupermarkets} onChange={handleSupermarketChange} />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                disabled={isUpdating}
                className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-primary-300"
              >
                {isUpdating ? "Aggiornamento..." : "Aggiorna supermercati"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
