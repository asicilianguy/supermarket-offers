"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout() {
  // Pulisci tutti i cookie dal server
  const cookieStore = cookies()

  // Rimuovi il cookie token
  cookieStore.delete("token")

  // Rimuovi anche altri possibili cookie di autenticazione
  cookieStore.delete("auth")
  cookieStore.delete("x-auth-token")
  cookieStore.delete("session")
  cookieStore.delete("user")

  // Reindirizza alla pagina di login
  redirect("/login")
}
