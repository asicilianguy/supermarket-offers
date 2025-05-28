"use client"

import { motion } from "framer-motion"
import { SUPERMARKETS } from "@/constants/supermarkets"

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

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {SUPERMARKETS.map((supermarket, index) => (
        <motion.div
          key={supermarket}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
          className={`
            checkbox-wrapper
            ${selectedSupermarkets.includes(supermarket) ? "checkbox-selected" : "checkbox-unselected"}
          `}
          onClick={() => handleToggle(supermarket)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="checkbox"
            checked={selectedSupermarkets.includes(supermarket)}
            onChange={() => {}}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm capitalize">{supermarket}</label>
        </motion.div>
      ))}
    </div>
  )
}
