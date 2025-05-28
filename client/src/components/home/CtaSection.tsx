"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function CtaSection() {
  const router = useRouter()

  return (
    <section className="py-16 bg-primary-600">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pronto a risparmiare sulla tua spesa?</h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
            Unisciti a migliaia di famiglie che risparmiano ogni giorno grazie a RisparmiApp.
          </p>
          <button
            onClick={() => router.push("/register")}
            className="bg-white hover:bg-gray-100 text-primary-600 font-medium py-3 px-8 rounded-lg shadow-md transition-colors"
          >
            Inizia ora — È gratuito
          </button>
        </motion.div>
      </div>
    </section>
  )
}
