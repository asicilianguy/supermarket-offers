"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const performLogout = async () => {
      try {
        // 1. Pulisci localStorage e sessionStorage
        localStorage.removeItem("token")
        sessionStorage.clear()

        // 2. Pulisci manualmente i cookie lato client
        document.cookie.split(";").forEach((cookie) => {
          const [name] = cookie.trim().split("=")
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`
        })

        // 3. Chiama l'endpoint API di logout
        const response = await fetch("/api/logout")

        if (!response.ok) {
          throw new Error("Errore durante il logout")
        }

        // 4. Attendi un breve periodo per assicurarsi che i cookie siano stati eliminati
        await new Promise((resolve) => setTimeout(resolve, 500))

        // 5. Reindirizza alla pagina di login
        window.location.href = "/login"
      } catch (err) {
        console.error("Errore durante il logout:", err)
        setError("Si è verificato un errore durante il logout. Riprova.")
        setIsLoggingOut(false)
      }
    }

    performLogout()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {isLoggingOut ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <h1 className="text-xl font-medium">Logout in corso...</h1>
            <p className="text-gray-500 mt-2">Verrai reindirizzato alla pagina di login.</p>
          </>
        ) : (
          <>
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-medium text-red-600">{error}</h1>
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Vai alla pagina di login
            </button>
          </>
        )}
      </div>
    </div>
  )
}
