"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useGetAllOffersQuery } from "@/redux/features/productOffer/productOfferApiSlice"
import OfferFilters from "@/components/offers/OfferFilters"
import OfferGrid from "@/components/offers/OfferGrid"
import OfferPagination from "@/components/offers/OfferPagination"
import { Skeleton } from "@/components/ui/skeleton" // Per lo skeleton loading
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Per messaggi di errore
import { Terminal } from "lucide-react" // Icona per l'alert
import { VALID_AISLES } from "@/constants/aisles"
import { useAppSelector } from "@/redux/store" // Per accedere allo stato utente (supermercato preferito)

const OFFERS_PER_PAGE = 12 // Puoi rendere questo configurabile se vuoi

const OffersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    supermarketAisle: "",
    chainName: "", // Aggiungiamo chainName per filtrare per supermercato
    brand: "", // Aggiungiamo brand
    // Potresti aggiungere altri filtri qui, es. sortBy
  })

  const { isAuthenticated, user } = useAppSelector((state) => state.user)

  // Imposta il supermercato preferito dell'utente come filtro iniziale se loggato
  useEffect(() => {
    if (isAuthenticated && user?.preferredSupermarket) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        chainName: user.preferredSupermarket,
      }))
    }
  }, [isAuthenticated, user?.preferredSupermarket])

  const {
    data: offersData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAllOffersQuery({
    page: currentPage,
    limit: OFFERS_PER_PAGE,
    supermarketAisle: filters.supermarketAisle || undefined, // Invia solo se valorizzato
    chainName: filters.chainName || undefined,
    brand: filters.brand || undefined,
    // sort: filters.sortBy || undefined,
  })

  const handleFilterChange = (filterName: string, filterValue: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: filterValue,
    }))
    setCurrentPage(1) // Resetta la pagina quando i filtri cambiano
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: OFFERS_PER_PAGE }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive" className="my-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Errore nel Caricamento delle Offerte</AlertTitle>
          <AlertDescription>
            {error?.data?.message || error?.message || "Si è verificato un errore imprevisto. Riprova più tardi."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Tutte le Offerte</h1>
      <OfferFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        aisles={VALID_AISLES} // Assicurati che VALID_AISLES sia importato
        // Potresti passare qui anche la lista dei supermercati e brand se vuoi popolarli dinamicamente
      />
      <div className="my-8">
        {(isLoading || isFetching) && !offersData ? (
          renderSkeletons()
        ) : offersData?.offers && offersData.offers.length > 0 ? (
          <OfferGrid offers={offersData.offers} isLoading={isFetching} />
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 dark:text-gray-400">Nessuna offerta trovata.</p>
            <p className="text-md text-gray-400 dark:text-gray-500 mt-2">
              Prova a modificare i filtri o torna più tardi.
            </p>
          </div>
        )}
      </div>
      {offersData && offersData.totalPages > 1 && (
        <OfferPagination
          currentPage={offersData.currentPage}
          totalPages={offersData.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default OffersPage
