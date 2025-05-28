"use client"

import { motion } from "framer-motion"
import { Percent } from "lucide-react"
import { useGetBestOffersQuery } from "@/redux/features/productOffer/productOfferApiSlice"

export default function BestOffers() {
  const { data: offers, isLoading } = useGetBestOffersQuery({ limit: 6 })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Percent className="h-5 w-5 mr-2 text-primary-500" />
            Migliori offerte
          </h2>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : offers && offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer: any) => (
              <motion.div
                key={offer._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
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

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-lg font-bold text-primary-600">€{offer.offerPrice.toFixed(2)}</p>
                    {offer.previousPrice && (
                      <p className="text-sm text-gray-500 line-through">€{offer.previousPrice.toFixed(2)}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Fino al {formatDate(offer.offerEndDate)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Nessuna offerta disponibile al momento</p>
          </div>
        )}
      </div>
    </div>
  )
}
