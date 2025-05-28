"use client"

import { motion } from "framer-motion"
import { SUPERMARKETS } from "@/constants/supermarkets"
import { Check, ShoppingBag } from "lucide-react"

interface SupermarketSelectorProps {
  selectedSupermarkets: string[]
  onChange: (supermarkets: string[]) => void
}

export default function SupermarketSelector({ selectedSupermarkets, onChange }: SupermarketSelectorProps) {
  const handleToggle = (supermarket: string) => {
    if (selectedSupermarkets.includes(supermarket)) {
      onChange(selectedSupermarkets.filter((s) => s !== supermarket))
    } else {
      onChange([...selectedSupermarkets, supermarket])
    }
  }

  // Funzione per ottenere un colore casuale ma coerente per ogni supermercato
  const getSupermarketColor = (name: string) => {
    const colors = [
      "bg-primary-100 text-primary-700",
      "bg-secondary-100 text-secondary-700",
      "bg-accent-100 text-accent-700",
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700",
      "bg-yellow-100 text-yellow-700",
      "bg-purple-100 text-purple-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700",
    ]

    // Usa il nome del supermercato per selezionare un colore in modo deterministico
    const index = name.length % colors.length
    return colors[index]
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {SUPERMARKETS.map((supermarket, index) => {
        const isSelected = selectedSupermarkets.includes(supermarket)
        const colorClass = getSupermarketColor(supermarket)

        return (
          <motion.div
            key={supermarket}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className={`supermarket-card ${isSelected ? "supermarket-card-selected" : "supermarket-card-unselected"}`}
            onClick={() => handleToggle(supermarket)}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="supermarket-card-content">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${colorClass}`}>
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium capitalize">{supermarket}</span>

              {isSelected && (
                <motion.div
                  className="supermarket-card-check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
