"use client"

import { useState } from "react"
import { Store } from "lucide-react"

interface SupermarketOffersProps {
  frequentedSupermarkets: string[]
}

export default function SupermarketOffers({ frequentedSupermarkets }: SupermarketOffersProps) {
  const [selectedSupermarket, setSelectedSupermarket] = useState<string>(
    frequentedSupermarkets.length > 0 ? frequentedSupermarkets[0] : "",
  )

  if (frequentedSupermarkets.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Store className="h-5 w-5 mr-2 text-primary-500" />
            Offerte per supermercato
          </h2>
        </div>
      </div>

      <div className="p-6">
        <div className="flex overflow-x-auto pb-2 mb-4 -mx-2 px-2">
          <div className="flex space-x-2">
            {frequentedSupermarkets.map((supermarket) => (
              <button
                key={supermarket}
                onClick={() => setSelectedSupermarket(supermarket)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize ${
                  selectedSupermarket === supermarket
                    ? "bg-primary-100 text-primary-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {supermarket}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center py-8">
          <p className="text-gray-500">Funzionalità in arrivo: visualizzazione delle offerte per supermercato</p>
          <p className="text-sm text-gray-400 mt-1">Stiamo lavorando per portarti presto questa funzionalità</p>
        </div>
      </div>
    </div>
  )
}
