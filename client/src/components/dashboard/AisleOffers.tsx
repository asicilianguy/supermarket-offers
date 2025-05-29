"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetOffersByAisleQuery } from "@/redux/features/productOffer/productOfferApiSlice"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

interface AisleOffersProps {
  aisle: string
  limit?: number
}

export default function AisleOffers({ aisle, limit = 4 }: AisleOffersProps) {
  const { data, isLoading } = useGetOffersByAisleQuery({
    aisle,
    limit,
    page: 1,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg capitalize">{aisle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const offers = data?.offers || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg capitalize flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          {aisle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {offers.length === 0 ? (
          <p className="text-sm text-gray-500">Nessuna offerta disponibile</p>
        ) : (
          <div className="space-y-2">
            {offers.slice(0, limit).map((offer) => (
              <div key={offer._id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex-1 pr-2">
                  <p className="text-sm font-medium line-clamp-1">{offer.productName}</p>
                  <p className="text-xs text-gray-500">{offer.chainName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary-600">€{offer.offerPrice.toFixed(2)}</p>
                  {offer.discountPercentage && <p className="text-xs text-red-600">-{offer.discountPercentage}%</p>}
                </div>
              </div>
            ))}
          </div>
        )}
        <Link
          href={`/offers?aisle=${encodeURIComponent(aisle)}`}
          className="block mt-3 text-xs text-center text-primary-600 hover:underline"
        >
          Vedi tutte le offerte di {aisle}
        </Link>
      </CardContent>
    </Card>
  )
}
