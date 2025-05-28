"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  useGetAllOffersQuery,
  useGetAllAislesQuery,
  useGetAllBrandsQuery,
} from "@/redux/features/productOffer/productOfferApiSlice"
import OfferFilters from "@/components/offers/OfferFilters"
import OfferGrid from "@/components/offers/OfferGrid"
import OfferPagination from "@/components/offers/OfferPagination"
import { SUPERMARKETS } from "@/constants/supermarkets"

export default function Offers() {
  const [filters, setFilters] = useState({
    chainName: "",
    supermarketAisle: "",
    brand: "",
    sort: "newest",
  })

  const [page, setPage] = useState(1)
  const limit = 20

  const { data: offersData, isLoading: isLoadingOffers } = useGetAllOffersQuery({
    page,
    limit,
    ...filters,
  })

  const { data: aisles } = useGetAllAislesQuery()
  const { data: brands } = useGetAllBrandsQuery()

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [filters])

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tutte le offerte
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <OfferFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          supermarkets={SUPERMARKETS}
          aisles={aisles || []}
          brands={brands || []}
        />
      </motion.div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <OfferGrid offers={offersData?.offers || []} isLoading={isLoadingOffers} />
      </motion.div>

      {offersData && offersData.totalPages > 1 && (
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <OfferPagination currentPage={page} totalPages={offersData.totalPages} onPageChange={handlePageChange} />
        </motion.div>
      )}
    </div>
  )
}
