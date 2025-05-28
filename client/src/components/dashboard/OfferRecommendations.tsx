"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tag, ChevronDown, ChevronUp } from "lucide-react"

interface Offer {
  _id: string
  productName: string
  offerPrice: number
  previousPrice?: number
  discountPercentage?: number
  chainName: string
  offerEndDate: string
}

interface ProductOffers {
  productName: string
  offers: Offer[]
}

interface OfferRecommendationsProps {
  offers: ProductOffers[]
  isLoading: boolean
}

export default function OfferRecommendations({ offers, isLoading }: OfferRecommendationsProps) {
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({})

  const toggleProduct = (productName: string) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productName]: !prev[productName],
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Tag className="h-5 w-5 mr-2 text-primary-500" />
            Offerte consigliate
          </h2>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : offers.length > 0 ? (
          <div className="space-y-4">
            {offers.map((productOffer) => (
              <div key={productOffer.productName} className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                  onClick={() => toggleProduct(productOffer.productName)}
                >
                  <h3 className="font-medium text-gray-900">{productOffer.productName}</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">{productOffer.offers.length} offerte</span>
                    {expandedProducts[productOffer.productName] ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedProducts[productOffer.productName] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="divide-y divide-gray-200">
                      {productOffer.offers.length > 0 ? (
                        productOffer.offers.map((offer) => (
                          <div key={offer._id} className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">{offer.productName}</p>
                                <p className="text-sm text-gray-500 capitalize">{offer.chainName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary-600">€{offer.offerPrice.toFixed(2)}</p>
                                {offer.previousPrice && (
                                  <p className="text-sm text-gray-500 line-through">
                                    €{offer.previousPrice.toFixed(2)}
                                  </p>
                                )}
                                {offer.discountPercentage && (
                                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    -{offer.discountPercentage}%
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Valida fino al {formatDate(offer.offerEndDate)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">Nessuna offerta trovata per questo prodotto</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Nessuna offerta consigliata</p>
            <p className="text-sm text-gray-400 mt-1">
              Aggiungi prodotti alla tua lista della spesa per ricevere consigli
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
