"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { SearchIcon } from "lucide-react"
import { useSearchOffersQuery } from "@/redux/features/productOffer/productOfferApiSlice"
import OfferGrid from "@/components/offers/OfferGrid"
import OfferPagination from "@/components/offers/OfferPagination"

export default function Search() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [searchTerm, setSearchTerm] = useState(query)
  const [page, setPage] = useState(1)
  const limit = 20

  const { data: searchResults, isLoading } = useSearchOffersQuery({ query, page, limit }, { skip: !query })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
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
        Cerca offerte
      </motion.h1>

      <motion.div
        className="max-w-2xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca prodotti in offerta..."
            className="flex-grow px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-3 rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </form>
      </motion.div>

      {query ? (
        <>
          <motion.div
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold">
              Risultati per &quot;{query}&quot;
              {searchResults && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({searchResults.offers.length} prodotti trovati)
                </span>
              )}
            </h2>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <OfferGrid offers={searchResults?.offers || []} isLoading={isLoading} />
          </motion.div>

          {searchResults && searchResults.totalPages > 1 && (
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <OfferPagination
                currentPage={page}
                totalPages={searchResults.totalPages}
                onPageChange={handlePageChange}
              />
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-gray-500">Inserisci un termine di ricerca per trovare prodotti in offerta</p>
        </motion.div>
      )}
    </div>
  )
}
