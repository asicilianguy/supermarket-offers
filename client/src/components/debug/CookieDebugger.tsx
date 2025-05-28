"use client"

import { useState, useEffect } from "react"

export default function CookieDebugger() {
  const [cookies, setCookies] = useState<Record<string, string>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateCookies = () => {
      const cookieObj: Record<string, string> = {}
      document.cookie.split(";").forEach((cookie) => {
        const [name, value] = cookie.trim().split("=")
        if (name) cookieObj[name] = value || ""
      })
      setCookies(cookieObj)
    }

    updateCookies()
    // Aggiorna i cookie ogni secondo
    const interval = setInterval(updateCookies, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full z-50"
      >
        🍪
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 max-w-md w-full max-h-96 overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Cookie Debugger</h3>
        <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {Object.keys(cookies).length === 0 ? (
        <p className="text-gray-500">Nessun cookie presente</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-1">Nome</th>
              <th className="text-left py-1">Valore</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(cookies).map(([name, value]) => (
              <tr key={name} className="border-t border-gray-200">
                <td className="py-1 pr-2 font-medium">{name}</td>
                <td className="py-1 truncate">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-2 pt-2 border-t border-gray-200">
        <button
          onClick={() => {
            document.cookie.split(";").forEach((cookie) => {
              const [name] = cookie.trim().split("=")
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
            })
          }}
          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
        >
          Elimina tutti i cookie
        </button>
      </div>
    </div>
  )
}
