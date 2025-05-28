"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { showToast } from "@/components/ui/Toast"

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        // 1. Pulisci localStorage
        localStorage.removeItem("token")
        localStorage.clear()

        // 2. Pulisci sessionStorage
        sessionStorage.clear()

        // 3. Pulisci i cookie lato client
        document.cookie.split(";").forEach((cookie) => {
          const [name] = cookie.trim().split("=")
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        })

        // 4. Chiama l'API di logout
        try {
          await fetch("/api/logout")
        } catch (error) {
          console.error("Errore durante la chiamata all'API di logout:", error)
        }

        // 5. Mostra il toast di successo
        showToast.success("Logout effettuato con successo")

        // 6. Attendi un breve periodo per assicurarsi che i cookie siano stati eliminati
        setTimeout(() => {
          // 7. Reindirizza alla pagina di login
          window.location.href = "/login"
        }, 1000)
      } catch (error) {
        console.error("Errore durante il logout:", error)
        showToast.error("Si è verificato un errore durante il logout")

        // Reindirizza comunque alla pagina di login in caso di errore
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
      }
    }

    performLogout()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Logout in corso...</h1>
        <p className="text-gray-600">Stai per essere reindirizzato alla pagina di login.</p>
      </div>
    </div>
  )
}
