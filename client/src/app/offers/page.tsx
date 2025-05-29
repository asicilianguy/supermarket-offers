"use client"

import React from "react"
import { VALID_AISLES } from "@/constants/aisles"
import OfferFilters from "@/components/offers/OfferFilters"

interface OfferFiltersProps {
  filters: {
    supermarketAisle: string
  }
  onFilterChange: (filterName: string, filterValue: string) => void
  aisles: string[] // Assuming aisles is an array of strings
}

const OffersPage: React.FC = () => {
  const [filters, setFilters] = React.useState({
    supermarketAisle: "",
  })

  const handleFilterChange = (filterName: string, filterValue: string) => {
    setFilters({
      ...filters,
      [filterName]: filterValue,
    })
  }

  return (
    <div className="container mx-auto p-4">
      <OfferFilters filters={filters} onFilterChange={handleFilterChange} aisles={VALID_AISLES} />
      {/* Other components and logic for displaying offers */}
    </div>
  )
}

export default OffersPage
