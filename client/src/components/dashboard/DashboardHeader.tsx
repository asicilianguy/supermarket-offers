"use client"

import { motion } from "framer-motion"

interface DashboardHeaderProps {
  user: {
    name: string
    frequentedSupermarkets: string[]
  }
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold text-gray-900">Benvenuto, {user.name.split(" ")[0]}</h1>
      <p className="text-gray-600 mt-2">Ecco le migliori offerte per te oggi</p>

      {user.frequentedSupermarkets.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Supermercati selezionati:</p>
          <div className="flex flex-wrap gap-2">
            {user.frequentedSupermarkets.map((supermarket) => (
              <span
                key={supermarket}
                className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm capitalize"
              >
                {supermarket}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
