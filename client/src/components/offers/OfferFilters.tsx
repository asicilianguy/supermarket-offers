"use client"

import type React from "react"
import { VALID_AISLES } from "@/constants/aisles"

interface OfferFiltersProps {
  filters: {
    supermarketAisle: string
  }
  onFilterChange: (filterName: string, filterValue: string) => void
}

const OfferFilters: React.FC<OfferFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="supermarketAisle" className="block text-sm font-medium text-gray-700">
          Reparto
        </label>
        <select
          id="supermarketAisle"
          value={filters.supermarketAisle}
          onChange={(e) => onFilterChange("supermarketAisle", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Tutti i reparti</option>
          {VALID_AISLES.map((aisle) => (
            <option key={aisle} value={aisle}>
              {aisle}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default OfferFilters
