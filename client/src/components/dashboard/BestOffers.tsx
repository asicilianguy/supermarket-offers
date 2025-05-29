"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface Offer {
  _id: string
  productName: string
  productQuantity?: string
  offerPrice: number
  previousPrice?: number
  discountPercentage?: number
  chainName: string
  brand?: string
}

interface BestOffersProps {
  offers: Offer[]
  isLoading: boolean
}

export default function BestOffers({ offers, isLoading }: BestOffersProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Migliori Offerte</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold">Migliori Offerte</h3>
        </div>
      </CardHeader>
      <CardContent>
        {offers.length === 0 ? (
          <p className="text-gray-500">Nessuna offerta disponibile al momento</p>
        ) : (
          <div className="space-y-4">
            {offers.slice(0, 5).map((offer, index) => (
              <motion.div
                key={offer._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{offer.productName}</h4>
                  <p className="text-sm text-gray-600">
                    {offer.brand && `${offer.brand} • `}
                    {offer.productQuantity}
                  </p>
                  <p className="text-sm text-gray-500">{offer.chainName}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">€{offer.offerPrice.toFixed(2)}</p>
                  {offer.previousPrice && (
                    <p className="text-sm text-gray-500 line-through">€{offer.previousPrice.toFixed(2)}</p>
                  )}
                  {offer.discountPercentage && (
                    <Badge variant="danger" size="sm" className="mt-1">
                      -{offer.discountPercentage}%
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <Link href="/offers" className="block mt-4 text-center text-primary-600 hover:underline">
          Vedi tutte le offerte
        </Link>
      </CardContent>
    </Card>
  )
}
