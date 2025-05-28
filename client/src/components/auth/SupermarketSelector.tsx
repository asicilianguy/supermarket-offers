"use client"

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
      {SUPERMARKETS.map((supermarket) => (
        <div
          key={supermarket}
          className={`
            flex items-center p-3 rounded-md cursor-pointer transition-colors
            ${
              selectedSupermarkets.includes(supermarket)
                ? "bg-primary-100 border border-primary-300"
                : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
            }
          `}
          onClick={() => handleToggle(supermarket)}
        >
          <input
            type="checkbox"
            checked={selectedSupermarkets.includes(supermarket)}
            onChange={() => {}}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm capitalize">{supermarket}</label>
        </div>
      ))}
    </div>
  )
}
