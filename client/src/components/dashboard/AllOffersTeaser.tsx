"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface Offer {
  _id: string
  productName: string
  offerPrice: number
  previousPrice?: number
  discountPercentage?: number
  chainName: string
}

interface AllOffersTeaserProps {
  offers: Offer[]
  isLoading: boolean
}

const AllOffersTeaser: React.FC<AllOffersTeaserProps> = ({ offers, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-3 border rounded-md">
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!offers || offers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary-600" />
            <h4 className="text-xl font-semibold text-gray-700">Ultime Offerte</h4>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Nessuna nuova offerta al momento. Torna a trovarci presto!</p>
        </CardContent>
      </Card>
    )
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary-600" />
          <h4 className="text-xl font-semibold text-gray-700">Dalle Nostre Scaffalature</h4>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {offers.map((offer) => (
            <motion.div key={offer._id} variants={itemVariants}>
              <Link href={`/offers?productName=${encodeURIComponent(offer.productName)}`} passHref>
                <div className="block p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white">
                  <p className="text-md font-semibold text-gray-800 line-clamp-1">{offer.productName}</p>
                  <p className="text-xs text-gray-500 mb-1">{offer.chainName}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary-600">€{offer.offerPrice.toFixed(2)}</p>
                    {offer.discountPercentage && <Badge variant="success">-{offer.discountPercentage}%</Badge>}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        <Link href="/offers" passHref>
          <Button variant="primary" className="w-full sm:w-auto">
            Scopri Tutte le Offerte
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default AllOffersTeaser
