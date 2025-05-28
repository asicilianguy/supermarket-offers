"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ShoppingCart, Tag, TrendingDown, Percent } from "lucide-react"

export default function SimpleHeroSection() {
  const router = useRouter()

  return (
    <div className="relative bg-gradient-to-b from-primary-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Risparmia sulla spesa, ogni giorno
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              RisparmiApp centralizza tutte le offerte dei supermercati che frequenti, aiutandoti a risparmiare tempo e
              denaro sulla tua spesa quotidiana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/register")}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors"
              >
                Inizia a risparmiare
              </button>
              <button
                onClick={() => router.push("/offers")}
                className="bg-white hover:bg-gray-50 text-primary-600 font-medium py-3 px-6 rounded-lg shadow-md border border-gray-200 transition-colors"
              >
                Scopri le offerte
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 6, ease: "easeInOut" }}
              >
                <div className="relative">
                  <ShoppingCart className="w-32 h-32 mx-auto text-primary-500" />

                  <motion.div
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-3 shadow-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  >
                    <Percent className="h-6 w-6" />
                  </motion.div>

                  <motion.div
                    className="absolute bottom-0 left-0 bg-green-500 text-white rounded-full p-3 shadow-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.5 }}
                  >
                    <TrendingDown className="h-6 w-6" />
                  </motion.div>

                  <motion.div
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-primary-500 text-white rounded-full p-3 shadow-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 1 }}
                  >
                    <Tag className="h-6 w-6" />
                  </motion.div>
                </div>

                <div className="mt-6 text-center">
                  <motion.div
                    className="inline-block bg-primary-100 text-primary-800 px-4 py-2 rounded-full font-bold text-lg"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 1.5 }}
                  >
                    Risparmia fino al 30%
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-yellow-400 text-white rounded-full p-4 shadow-lg"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, delay: 0.2 }}
              >
                <span className="text-xl font-bold">-30%</span>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-green-600 text-white rounded-full p-4 shadow-lg"
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, delay: 0.7 }}
              >
                <span className="text-xl font-bold">€€€</span>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-3 shadow-lg"
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, delay: 1.2 }}
              >
                <span className="text-lg font-bold">2x1</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  )
}
