"use client"

import { useState } from "react"
import { useGetAllOffersQuery } from "@/redux/features/productOffer/productOfferApiSlice"
import OfferFilters from "@/components/offers/OfferFilters"
import OfferGrid from "@/components/offers/OfferGrid"
import OfferPagination from "@/components/offers/OfferPagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { VALID_AISLES } from "@/constants/aisles"

interface Filters {
  supermarketAisle: string
  chainName: string
  brand: string
  sort: string
}

export default function OffersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    supermarketAisle: "",
    chainName: "",
    brand: "",
    sort: "createdAt_desc",
  })

  // Query per recuperare le offerte
  const {
    data: offersData,
    error,
    isLoading,
    isFetching,
  } = useGetAllOffersQuery({
    page: currentPage,
    limit: 12,
    ...filters,
  })

  // Gestione cambio filtri
  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset alla prima pagina quando cambiano i filtri
  }

  // Gestione cambio pagina
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Skeleton loading
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tutte le Offerte</h1>

      {/* Filtri */}
      <div className="mb-8">
        <OfferFilters filters={filters} onFilterChange={handleFilterChange} aisles={VALID_AISLES} />
      </div>

      {/* Gestione errori */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Errore nel caricamento</AlertTitle>
          <AlertDescription>
            Si è verificato un errore durante il caricamento delle offerte. Riprova più tardi.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading state */}
      {(isLoading || isFetching) && renderSkeletons()}

      {/* Contenuto principale */}
      {!isLoading && !error && offersData && (
        <>
          {offersData.offers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Nessuna offerta trovata con i filtri selezionati.</p>
            </div>
          ) : (
            <>
              <OfferGrid offers={offersData.offers} />

              {/* Paginazione */}
              {offersData.totalPages > 1 && (
                <div className="mt-8">
                  <OfferPagination
                    currentPage={currentPage}
                    totalPages={offersData.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
