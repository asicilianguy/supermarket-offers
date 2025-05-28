"use client"

import { motion } from "framer-motion"
import { Tag, ShoppingCart, Calendar } from "lucide-react"

interface OfferProps {
  _id: string
  productName: string
  offerPrice: number
  previousPrice?: number
  discountPercentage?: number
  chainName: string
  offerEndDate: string
  brand?: string
  supermarketAisle: string
  index: number
}

export default function OfferCard({
  productName,
  offerPrice,
  previousPrice,
  discountPercentage,
  chainName,
  offerEndDate,
  brand,
  supermarketAisle,
  index,
}: OfferProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  return (
    <motion.div
      className="card-stacked"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900 line-clamp-2">{productName}</h3>
            {discountPercentage && (
              <motion.div
                className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Tag className="h-3 w-3 mr-1" />-{discountPercentage}%
              </motion.div>
            )}
          </div>

          <div className="flex items-center text-xs text-gray-500 mb-3">
            <span className="capitalize bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full mr-2">{chainName}</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-full">{supermarketAisle}</span>
          </div>

          {brand && <p className="text-xs text-gray-500 mb-2">Marca: {brand}</p>}

          <div className="mt-4 flex justify-between items-end">
            <div>
              <div className="flex items-baseline">
                <span className="text-lg font-bold text-primary-600">€{offerPrice.toFixed(2)}</span>
                {previousPrice && (
                  <span className="text-sm text-gray-500 line-through ml-2">€{previousPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Fino al {formatDate(offerEndDate)}</span>
            </div>
          </div>

          <motion.button
            className="mt-3 w-full flex items-center justify-center px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Aggiungi alla lista
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
