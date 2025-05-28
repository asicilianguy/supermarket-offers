"use client"
import OfferCard from "./OfferCard"

interface Offer {
  _id: string
  productName: string
  offerPrice: number
  previousPrice?: number
  discountPercentage?: number
  chainName: string
  offerEndDate: string
  brand?: string
  supermarketAisle: string
}

interface OfferGridProps {
  offers: Offer[]
  isLoading: boolean
}

export default function OfferGrid({ offers, isLoading }: OfferGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nessuna offerta trovata</p>
        <p className="text-sm text-gray-400 mt-1">Prova a modificare i filtri di ricerca</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {offers.map((offer, index) => (
        <OfferCard key={offer._id} {...offer} index={index} />
      ))}
    </div>
  )
}
