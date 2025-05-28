"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    // Funzione per pulire tutti i cookie e localStorage
    const clearAuthData = () => {
      // 1. Pulisci localStorage
      localStorage.removeItem("token")

      // 2. Pulisci tutti i possibili cookie di autenticazione
      Cookies.remove("token")
      Cookies.remove("token", { path: "/" })

      // 3. Usa l'API nativa dei cookie per una pulizia più aggressiva
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "x-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

      // 4. Pulisci sessionStorage
      sessionStorage.clear()
    }

    // Esegui la pulizia
    clearAuthData()

    // Reindirizza alla pagina di login
    router.push("/login")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <h1 className="text-xl font-medium">Logout in corso...</h1>
        <p className="text-gray-500 mt-2">Verrai reindirizzato alla pagina di login.</p>
      </div>
    </div>
  )
}
