"use client"

import { useState } from "react"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"

interface OfferFiltersProps {
  filters: {
    chainName: string
    supermarketAisle: string
    brand: string
    sort: string
  }
  onFilterChange: (name: string, value: string) => void
  supermarkets: string[]
  aisles: string[]
  brands: string[]
}

export default function OfferFilters({ filters, onFilterChange, supermarkets, aisles, brands }: OfferFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const sortOptions = [
    { value: "newest", label: "Più recenti" },
    { value: "price", label: "Prezzo (dal più basso)" },
    { value: "discount", label: "Sconto (dal più alto)" },
    { value: "endDate", label: "Data di scadenza" },
  ]

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div
        className="p-4 border-b border-gray-200 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2 text-primary-500" />
          <h3 className="font-medium text-gray-900">Filtri</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="chainName" className="block text-sm font-medium text-gray-700 mb-1">
                Supermercato
              </label>
              <select
                id="chainName"
                value={filters.chainName}
                onChange={(e) => onFilterChange("chainName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tutti i supermercati</option>
                {supermarkets.map((supermarket) => (
                  <option key={supermarket} value={supermarket} className="capitalize">
                    {supermarket}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="supermarketAisle" className="block text-sm font-medium text-gray-700 mb-1">
                Reparto
              </label>
              <select
                id="supermarketAisle"
                value={filters.supermarketAisle}
                onChange={(e) => onFilterChange("supermarketAisle", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tutti i reparti</option>
                {aisles.map((aisle) => (
                  <option key={aisle} value={aisle}>
                    {aisle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Marca
              </label>
              <select
                id="brand"
                value={filters.brand}
                onChange={(e) => onFilterChange("brand", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tutte le marche</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                Ordina per
              </label>
              <select
                id="sort"
                value={filters.sort}
                onChange={(e) => onFilterChange("sort", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
