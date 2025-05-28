"use client"

import { motion } from "framer-motion"

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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {offers.map((offer, index) => (
        <motion.div
          key={offer._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-900">{offer.productName}</p>
                <p className="text-sm text-gray-500 capitalize">{offer.chainName}</p>
              </div>
              {offer.discountPercentage && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  -{offer.discountPercentage}%
                </span>
              )}
            </div>

            {offer.brand && <p className="text-xs text-gray-500 mb-2">Marca: {offer.brand}</p>}

            <p className="text-xs text-gray-500 mb-4">Reparto: {offer.supermarketAisle}</p>

            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-lg font-bold text-primary-600">€{offer.offerPrice.toFixed(2)}</p>
                {offer.previousPrice && (
                  <p className="text-sm text-gray-500 line-through">€{offer.previousPrice.toFixed(2)}</p>
                )}
              </div>
              <p className="text-xs text-gray-500">Fino al {formatDate(offer.offerEndDate)}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
