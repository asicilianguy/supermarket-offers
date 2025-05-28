"use client"

import { useRouter } from "next/navigation"
import { ShoppingCart, Tag, TrendingDown, Percent } from "lucide-react"

export default function SimpleHeroSection() {
  const router = useRouter()

  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Risparmia sulla spesa, ogni giorno
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              RisparmiApp centralizza tutte le offerte dei supermercati che frequenti, aiutandoti a risparmiare tempo e
              denaro sulla tua spesa quotidiana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => router.push("/register")} className="btn btn-primary">
                Inizia a risparmiare
              </button>
              <button onClick={() => router.push("/offers")} className="btn btn-secondary">
                Scopri le offerte
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="relative">
                  <ShoppingCart className="w-32 h-32 mx-auto text-blue-500" />

                  <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-3 shadow-lg">
                    <Percent className="h-6 w-6" />
                  </div>

                  <div className="absolute bottom-0 left-0 bg-green-500 text-white rounded-full p-3 shadow-lg">
                    <TrendingDown className="h-6 w-6" />
                  </div>

                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-blue-500 text-white rounded-full p-3 shadow-lg">
                    <Tag className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold text-lg">
                    Risparmia fino al 30%
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-white rounded-full p-4 shadow-lg">
                <span className="text-xl font-bold">-30%</span>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-green-600 text-white rounded-full p-4 shadow-lg">
                <span className="text-xl font-bold">€€€</span>
              </div>

              <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-3 shadow-lg">
                <span className="text-lg font-bold">2x1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
