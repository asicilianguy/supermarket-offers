"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Percent, TrendingDown } from "lucide-react"
import Link from "next/link"

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
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Migliori Offerte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          Migliori Offerte
        </CardTitle>
      </CardHeader>
      <CardContent>
        {offers.length === 0 ? (
          <p className="text-gray-500">Nessuna offerta disponibile al momento</p>
        ) : (
          <div className="space-y-4">
            {offers.slice(0, 5).map((offer) => (
              <div key={offer._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
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
                    <Badge className="mt-1" variant="destructive">
                      <Percent className="h-3 w-3 mr-1" />
                      {offer.discountPercentage}%
                    </Badge>
                  )}
                </div>
              </div>
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
