"use client"

import { useEffect } from "react"
import { logout } from "../actions/auth"

export default function LogoutPage() {
  useEffect(() => {
    // Pulisci localStorage e sessionStorage
    localStorage.removeItem("token")
    sessionStorage.clear()

    // Pulisci i cookie lato client (come backup)
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.trim().split("=")
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })

    // Chiama l'azione server per pulire i cookie lato server
    logout()
  }, [])

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
