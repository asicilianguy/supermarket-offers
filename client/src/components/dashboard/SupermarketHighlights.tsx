"use client"

import type React from "react"

import { useGetOffersBySupermarketQuery } from "@/redux/features/productOffer/productOfferApiSlice"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Store } from "lucide-react"

interface SupermarketHighlightsProps {
  supermarkets: string[]
}

interface SingleSupermarketProps {
  chainName: string
}

const SingleSupermarketPreview: React.FC<SingleSupermarketProps> = ({ chainName }) => {
  const { data, isLoading, isError } = useGetOffersBySupermarketQuery({
    chainName,
    limit: 3,
    page: 1,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
          <Skeleton className="h-8 w-1/2 mt-2" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !data || data.offers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold capitalize text-gray-700">{chainName}</h4>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Nessuna offerta speciale trovata per {chainName} al momento.</p>
          <Link href={`/offers?chainName=${encodeURIComponent(chainName)}`} passHref>
            <Button variant="link" className="mt-2 p-0 h-auto text-primary-600 hover:text-primary-700">
              Esplora comunque &rarr;
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card hover className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary-600" />
          <h4 className="text-lg font-semibold capitalize text-gray-700">{chainName}</h4>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        {data.offers.map((offer) => (
          <div key={offer._id} className="p-2 border rounded-md hover:bg-gray-50 transition-colors">
            <p className="text-sm font-medium line-clamp-1 text-gray-800">{offer.productName}</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm font-bold text-primary-600">€{offer.offerPrice.toFixed(2)}</p>
              {offer.discountPercentage && (
                <Badge variant="success" size="sm">
                  -{offer.discountPercentage}%
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
      <div className="p-4 mt-auto">
        <Link href={`/offers?chainName=${encodeURIComponent(chainName)}`} passHref>
          <Button variant="outline" className="w-full border-primary-600 text-primary-600 hover:bg-primary-50">
            Vedi tutte le offerte di {chainName}
          </Button>
        </Link>
      </div>
    </Card>
  )
}

const SupermarketHighlights: React.FC<SupermarketHighlightsProps> = ({ supermarkets }) => {
  if (!supermarkets || supermarkets.length === 0) {
    return null // O un messaggio che invita a selezionare i supermercati preferiti
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {supermarkets.map((supermarket) => (
        <motion.div key={supermarket} variants={itemVariants}>
          <SingleSupermarketPreview chainName={supermarket} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default SupermarketHighlights
