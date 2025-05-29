"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AisleOffers from "./AisleOffers" // Assuming AisleOffers shows offers for one aisle
import {
  ChevronDown,
  ChevronUp,
  Apple,
  Beef,
  Milk,
  GlassWater,
  Snowflake,
  Sandwich,
  PackageSearch,
  ShoppingBasket,
} from "lucide-react"
import Link from "next/link"

interface PopularAislesGridProps {
  aisles: string[]
}

const aisleIcons: { [key: string]: React.ElementType } = {
  "frutta e verdura": Apple,
  carne: Beef,
  latticini: Milk,
  bevande: GlassWater,
  surgelati: Snowflake,
  "pane e pasticceria": Sandwich,
  dispensa: PackageSearch,
  default: ShoppingBasket,
}

const PopularAislesGrid: React.FC<PopularAislesGridProps> = ({ aisles }) => {
  const [selectedAisle, setSelectedAisle] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Esplora per Reparto</h2>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {aisles.map((aisle) => {
          const IconComponent = aisleIcons[aisle.toLowerCase()] || aisleIcons["default"]
          return (
            <motion.div key={aisle} variants={itemVariants}>
              <Card
                hover
                className={`cursor-pointer transition-all duration-300 ease-in-out ${selectedAisle === aisle ? "ring-2 ring-primary-500 shadow-lg" : "hover:shadow-md"}`}
                onClick={() => setSelectedAisle(selectedAisle === aisle ? null : aisle)}
              >
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <IconComponent className="w-10 h-10 mb-2 text-primary-600" />
                  <p className="text-sm font-semibold capitalize text-gray-700">{aisle}</p>
                  {selectedAisle === aisle ? (
                    <ChevronUp className="mt-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="mt-1 h-4 w-4" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {selectedAisle && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <h3 className="text-xl font-semibold text-primary-700 capitalize">Offerte per {selectedAisle}</h3>
            </CardHeader>
            <CardContent>
              <AisleOffers aisle={selectedAisle} limit={4} />
              <Link href={`/offers?aisle=${encodeURIComponent(selectedAisle)}`} passHref>
                <Button variant="link" className="mt-4 text-primary-600 hover:text-primary-700">
                  Vedi tutte le offerte per {selectedAisle} &rarr;
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default PopularAislesGrid
