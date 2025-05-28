import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  // Lista di tutti i possibili nomi di cookie da eliminare
  const cookieNames = ["token", "auth", "x-auth-token", "session", "user", "jwt"]

  // Lista di tutti i possibili domini (incluso nessun dominio)
  const domains = ["", ".localhost", "localhost"]

  // Lista di tutti i possibili path
  const paths = ["/", "", "/dashboard", "/profile", "/login"]

  // Crea una risposta con header Set-Cookie per eliminare tutti i cookie
  const response = NextResponse.json({ success: true, message: "Logout successful" })

  // Elimina i cookie usando l'API cookies
  const cookieStore = cookies()
  cookieNames.forEach((name) => {
    cookieStore.delete(name)
  })

  // Imposta esplicitamente gli header Set-Cookie per forzare l'eliminazione dei cookie
  // per tutte le combinazioni di nomi, domini e path
  cookieNames.forEach((name) => {
    domains.forEach((domain) => {
      paths.forEach((path) => {
        // Crea un header Set-Cookie che forza l'eliminazione del cookie
        const cookieValue = `${name}=; Max-Age=0; Path=${path}; HttpOnly; Secure; SameSite=Strict${domain ? `; Domain=${domain}` : ""}`

        // Aggiungi l'header alla risposta
        response.headers.append("Set-Cookie", cookieValue)
      })
    })
  })

  return response
}
