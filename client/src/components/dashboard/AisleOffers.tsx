"use client"

import { Badge } from "@/components/ui/badge"
import { useGetOffersByAisleQuery } from "@/redux/features/productOffer/productOfferApiSlice"
import { Skeleton } from "@/components/ui/skeleton"

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
      <div className="space-y-2">
        {[...Array(limit)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    )
  }

  const offers = data?.offers || []

  if (offers.length === 0) {
    return <p className="text-sm text-gray-500">Nessuna offerta disponibile per {aisle}.</p>
  }

  return (
    <div className="space-y-3">
      {offers.slice(0, limit).map((offer) => (
        <div
          key={offer._id}
          className="flex items-center justify-between py-2 px-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex-1 pr-2">
            <p className="text-sm font-medium line-clamp-1 text-gray-800">{offer.productName}</p>
            <p className="text-xs text-gray-500">{offer.chainName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-primary-600">€{offer.offerPrice.toFixed(2)}</p>
            {offer.discountPercentage && (
              <Badge variant="success" size="sm" className="mt-1">
                -{offer.discountPercentage}%
              </Badge>
            )}
          </div>
        </div>
      ))}
      {/* Link to all offers for this aisle is now in PopularAislesGrid */}
    </div>
  )
}
