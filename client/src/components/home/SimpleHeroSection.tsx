"use client"

import { useRouter } from "next/navigation"
import { ShoppingCart, Tag, TrendingDown, Percent } from "lucide-react"
import { motion } from "framer-motion"

export default function SimpleHeroSection() {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-primary-50 to-white">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              <span className="text-primary-600">Risparmia</span> sulla spesa, ogni giorno
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-lg mx-auto lg:mx-0">
              RisparmiApp centralizza tutte le offerte dei supermercati che frequenti, aiutandoti a risparmiare tempo e
              denaro sulla tua spesa quotidiana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                onClick={() => router.push("/register")}
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Inizia a risparmiare
              </motion.button>
              <motion.button
                onClick={() => router.push("/offers")}
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Scopri le offerte
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md">
              <motion.div
                className="bg-white rounded-3xl p-10 shadow-card"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 6, ease: "easeInOut" }}
              >
                <div className="relative">
                  <ShoppingCart className="w-32 h-32 mx-auto text-primary-500" />

                  <motion.div
                    className="absolute top-0 right-0 bg-accent-500 text-white rounded-full p-3 shadow-lg"
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
                  >
                    <Percent className="h-6 w-6" />
                  </motion.div>

                  <motion.div
                    className="absolute bottom-0 left-0 bg-secondary-500 text-white rounded-full p-3 shadow-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
                  >
                    <TrendingDown className="h-6 w-6" />
                  </motion.div>

                  <motion.div
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-primary-500 text-white rounded-full p-3 shadow-lg"
                    animate={{ x: [0, 5, 0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut" }}
                  >
                    <Tag className="h-6 w-6" />
                  </motion.div>
                </div>

                <div className="mt-6 text-center">
                  <div className="inline-block bg-primary-100 text-primary-800 px-6 py-3 rounded-full font-bold text-lg">
                    Risparmia fino al 30%
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-accent-400 text-white rounded-full p-4 shadow-lg"
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 7, ease: "easeInOut" }}
              >
                <span className="text-xl font-bold">-30%</span>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-secondary-600 text-white rounded-full p-4 shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
              >
                <span className="text-xl font-bold">€€€</span>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-primary-500 text-white rounded-full p-3 shadow-lg"
                animate={{ y: [0, -5, 0, 5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 6, ease: "easeInOut" }}
              >
                <span className="text-lg font-bold">2x1</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
