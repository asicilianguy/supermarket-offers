"use client"

import { useRouter } from "next/navigation"
import { ShoppingCart, Tag, TrendingDown, Percent } from "lucide-react"
import { motion } from "framer-motion"

export default function SimpleHeroSection() {
  const router = useRouter()

  // Varianti per animazioni
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  // Varianti per le carte sovrapposte
  const stackedCardVariants = {
    initial: { y: 0, rotate: 0, scale: 0.95, opacity: 0 },
    animate: (i: number) => ({
      y: i * -8,
      rotate: i * -2,
      scale: 1 - i * 0.05,
      opacity: 1 - i * 0.15,
      transition: { duration: 0.4, delay: i * 0.1 },
    }),
  }

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 bg-gradient-to-b from-primary-50 to-white">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="mobile-container relative z-10">
        <motion.div
          className="flex flex-col-reverse md:flex-row md:items-center md:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center md:text-left mt-8 md:mt-0 md:w-1/2" variants={itemVariants}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
              <span className="text-primary-600">Risparmia</span> sulla spesa, ogni giorno
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0">
              RisparmiApp centralizza tutte le offerte dei supermercati che frequenti, aiutandoti a risparmiare tempo e
              denaro sulla tua spesa quotidiana.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
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

          <motion.div className="flex justify-center md:w-1/2" variants={cardVariants}>
            <div className="relative w-full max-w-xs sm:max-w-sm">
              {/* Carte sovrapposte */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 left-0 right-0 bg-white rounded-3xl p-6 sm:p-8 shadow-card"
                  custom={i}
                  variants={stackedCardVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    zIndex: 3 - i,
                    transformOrigin: "center bottom",
                  }}
                >
                  {i === 0 && (
                    <div className="relative">
                      <ShoppingCart className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-primary-500" />

                      <motion.div
                        className="absolute top-0 right-0 bg-accent-500 text-white rounded-full p-2 sm:p-3 shadow-lg"
                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
                      >
                        <Percent className="h-4 w-4 sm:h-6 sm:w-6" />
                      </motion.div>

                      <motion.div
                        className="absolute bottom-0 left-0 bg-secondary-500 text-white rounded-full p-2 sm:p-3 shadow-lg"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
                      >
                        <TrendingDown className="h-4 w-4 sm:h-6 sm:w-6" />
                      </motion.div>

                      <motion.div
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-primary-500 text-white rounded-full p-2 sm:p-3 shadow-lg"
                        animate={{ x: [0, 5, 0, -5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut" }}
                      >
                        <Tag className="h-4 w-4 sm:h-6 sm:w-6" />
                      </motion.div>

                      <div className="mt-4 sm:mt-6 text-center">
                        <div className="inline-block bg-primary-100 text-primary-800 px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-lg">
                          Risparmia fino al 30%
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Elementi fluttuanti */}
              <motion.div
                className="absolute -top-4 -right-4 bg-accent-400 text-white rounded-full p-3 sm:p-4 shadow-lg z-10"
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 7, ease: "easeInOut" }}
              >
                <span className="text-lg sm:text-xl font-bold">-30%</span>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-secondary-600 text-white rounded-full p-3 sm:p-4 shadow-lg z-10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
              >
                <span className="text-lg sm:text-xl font-bold">€€€</span>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-4 sm:-right-8 transform -translate-y-1/2 bg-primary-500 text-white rounded-full p-2 sm:p-3 shadow-lg z-10"
                animate={{ y: [0, -5, 0, 5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 6, ease: "easeInOut" }}
              >
                <span className="text-base sm:text-lg font-bold">2x1</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
