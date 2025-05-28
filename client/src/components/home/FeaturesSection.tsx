"use client"

import { motion } from "framer-motion"
import { ShoppingCart, Search, Clock, PiggyBank } from "lucide-react"

const features = [
  {
    icon: <ShoppingCart className="h-8 w-8 text-primary-600" />,
    title: "Lista della spesa intelligente",
    description:
      "Crea la tua lista della spesa e ricevi suggerimenti sulle offerte disponibili per i prodotti che ti interessano.",
  },
  {
    icon: <Search className="h-8 w-8 text-primary-600" />,
    title: "Ricerca centralizzata",
    description:
      "Cerca tra migliaia di prodotti in offerta in tutti i supermercati, filtrati in base alle tue preferenze.",
  },
  {
    icon: <Clock className="h-8 w-8 text-primary-600" />,
    title: "Risparmia tempo",
    description: "Non perdere più tempo a sfogliare volantini: tutte le offerte sono centralizzate in un'unica app.",
  },
  {
    icon: <PiggyBank className="h-8 w-8 text-primary-600" />,
    title: "Risparmia denaro",
    description: "Trova le migliori offerte sui prodotti che acquisti regolarmente e riduci la tua spesa settimanale.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Funzionalità principali</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            RisparmiApp ti offre strumenti potenti per ottimizzare la tua spesa e risparmiare denaro.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
