import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface AisleOffersProps {
  loading: boolean
  offers: {
    aisle: string
    discount: string
  }[]
}

const AisleOffers: React.FC<AisleOffersProps> = ({ loading, offers }) => {
  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    )
  }

  if (!offers || offers.length === 0) {
    return <p>No aisle offers available.</p>
  }

  return (
    <div className="space-y-2">
      {offers.map((offer, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span>{offer.aisle}:</span>
          <Badge variant="secondary">{offer.discount}</Badge>
        </div>
      ))}
    </div>
  )
}

export default AisleOffers
