"use client"

import type React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardBody, CardHeader, CardFooter, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tag, ExternalLink } from "lucide-react" // Add ExternalLink

import type { Offer } from "@/types/Offer"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

interface BestOffersProps {
  offers: Offer[]
}

const BestOffers: React.FC<BestOffersProps> = ({ offers }) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {offers &&
        offers.map((offer) => (
          <motion.div key={offer._id} variants={itemVariants} className="h-full">
            <Card
              hover
              className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="pb-2">
                {offer.discountPercentage && (
                  <Badge variant="destructive" className="absolute top-3 right-3 text-sm py-1 px-2">
                    -{offer.discountPercentage}% SCONTO
                  </Badge>
                )}
                <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2 leading-tight h-14">
                  {offer.productName}
                </CardTitle>
                <p className="text-xs text-gray-500 flex items-center pt-1">
                  <Tag size={14} className="mr-1 text-primary-500" /> {offer.chainName}
                </p>
              </CardHeader>
              <CardBody className="flex-grow py-2">
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-2xl font-bold text-primary-600">€{offer.offerPrice.toFixed(2)}</p>
                  {offer.previousPrice && (
                    <p className="text-sm text-gray-400 line-through">€{offer.previousPrice.toFixed(2)}</p>
                  )}
                </div>
                {offer.supermarketAisle && offer.supermarketAisle.length > 0 && (
                  <p className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">
                    Reparto: {offer.supermarketAisle.join(", ")}
                  </p>
                )}
              </CardBody>
              <CardFooter className="pt-2">
                <Link
                  href={`/offers?productName=${encodeURIComponent(offer.productName)}&chainName=${encodeURIComponent(offer.chainName)}`}
                  passHref
                >
                  <Button variant="primary" className="w-full">
                    Vedi Dettagli <ExternalLink size={16} className="ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
    </motion.div>
  )
}

export default BestOffers
