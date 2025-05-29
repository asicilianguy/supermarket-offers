"use client"

import { Card, CardBody, CardHeader } from "@heroui/react"
import { Chip } from "@heroui/react"
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
      <Card className="w-full">
        <CardHeader className="flex gap-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <div className="flex flex-col">
              <p className="text-md font-semibold capitalize">{aisle}</p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardBody>
      </Card>
    )
  }

  const offers = data?.offers || []

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          <div className="flex flex-col">
            <p className="text-md font-semibold capitalize">{aisle}</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
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
                  <p className="text-sm font-bold text-primary">€{offer.offerPrice.toFixed(2)}</p>
                  {offer.discountPercentage && (
                    <Chip color="danger" size="sm">
                      -{offer.discountPercentage}%
                    </Chip>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <Link
          href={`/offers?aisle=${encodeURIComponent(aisle)}`}
          className="block mt-3 text-xs text-center text-primary hover:underline"
        >
          Vedi tutte le offerte di {aisle}
        </Link>
      </CardBody>
    </Card>
  )
}
