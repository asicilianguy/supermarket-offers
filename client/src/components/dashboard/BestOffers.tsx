"use client"

import { Card, CardBody, CardHeader } from "@heroui/react"
import { Chip } from "@heroui/react"
import { TrendingDown } from "lucide-react"
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
      <Card className="w-full">
        <CardHeader className="flex gap-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Migliori Offerte</p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Migliori Offerte</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
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
                  <p className="text-lg font-bold text-primary">€{offer.offerPrice.toFixed(2)}</p>
                  {offer.previousPrice && (
                    <p className="text-sm text-gray-500 line-through">€{offer.previousPrice.toFixed(2)}</p>
                  )}
                  {offer.discountPercentage && (
                    <Chip color="danger" size="sm" className="mt-1">
                      -{offer.discountPercentage}%
                    </Chip>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <Link href="/offers" className="block mt-4 text-center text-primary hover:underline">
          Vedi tutte le offerte
        </Link>
      </CardBody>
    </Card>
  )
}
