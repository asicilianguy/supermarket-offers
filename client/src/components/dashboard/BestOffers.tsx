import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface BestOffer {
  id: number
  title: string
  description: string
  discount: string
}

const bestOffersData: BestOffer[] = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 50% off on selected items",
    discount: "50%",
  },
  {
    id: 2,
    title: "Electronics Discount",
    description: "Get 20% off on all electronics",
    discount: "20%",
  },
  {
    id: 3,
    title: "Fashion Fiesta",
    description: "Buy 2 get 1 free on all clothing",
    discount: "Buy 2 get 1",
  },
]

const BestOffers = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Best Offers</h2>
        <div className="space-y-3">
          {bestOffersData.map((offer) => (
            <div key={offer.id} className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">{offer.title}</h3>
                <p className="text-xs text-gray-500">{offer.description}</p>
              </div>
              <Badge className="rounded-full px-2 py-1 text-xs font-semibold">{offer.discount}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default BestOffers
