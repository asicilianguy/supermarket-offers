"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { SUPERMARKET_CHAINS } from "@/constants/supermarkets" // Importa le catene di supermercati

interface OfferFiltersProps {
  filters: {
    supermarketAisle: string
    chainName: string
    brand: string
  }
  onFilterChange: (filterName: string, filterValue: string) => void
  aisles: string[]
  // Aggiungi qui altre props se necessario, es. allBrands, allChains
}

const OfferFilters: React.FC<OfferFiltersProps> = ({ filters, onFilterChange, aisles }) => {
  const handleResetFilters = () => {
    onFilterChange("supermarketAisle", "")
    onFilterChange("chainName", "")
    onFilterChange("brand", "")
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <Label htmlFor="supermarketAisle" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Reparto
          </Label>
          <Select
            value={filters.supermarketAisle || "allAisles"}
            onValueChange={(value) => onFilterChange("supermarketAisle", value)}
          >
            <SelectTrigger id="supermarketAisle" className="w-full mt-1">
              <SelectValue placeholder="Tutti i reparti" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allAisles">Tutti i reparti</SelectItem>
              {aisles.map((aisle) => (
                <SelectItem key={aisle} value={aisle}>
                  {aisle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="chainName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Supermercato
          </Label>
          <Select
            value={filters.chainName || "allChains"}
            onValueChange={(value) => onFilterChange("chainName", value)}
          >
            <SelectTrigger id="chainName" className="w-full mt-1">
              <SelectValue placeholder="Tutti i supermercati" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allChains">Tutti i supermercati</SelectItem>
              {SUPERMARKET_CHAINS.map((chain) => (
                <SelectItem key={chain.value} value={chain.value}>
                  {chain.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="brand" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Marca
          </Label>
          <Input
            id="brand"
            type="text"
            placeholder="Es. Barilla, Mulino Bianco..."
            value={filters.brand}
            onChange={(e) => onFilterChange("brand", e.target.value)}
            className="w-full mt-1"
          />
          {/* Potresti sostituire questo con un Select popolato da useGetAllBrandsQuery se preferisci */}
        </div>

        <div className="flex items-end">
          <Button onClick={handleResetFilters} variant="outline" className="w-full">
            <X className="mr-2 h-4 w-4" /> Reset Filtri
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OfferFilters
