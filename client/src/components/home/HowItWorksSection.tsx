"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Registrati",
    description: "Crea un account gratuito e seleziona i supermercati che frequenti abitualmente.",
  },
  {
    number: "02",
    title: "Crea la tua lista della spesa",
    description: "Aggiungi i prodotti che desideri acquistare alla tua lista della spesa personale.",
  },
  {
    number: "03",
    title: "Scopri le offerte",
    description: "Ricevi suggerimenti sulle offerte disponibili per i prodotti nella tua lista.",
  },
  {
    number: "04",
    title: "Risparmia",
    description: "Approfitta delle migliori offerte e risparmia sulla tua spesa settimanale.",
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Come funziona</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Iniziare a risparmiare con RisparmiApp è semplice e veloce.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white p-6 rounded-xl shadow-md h-full">
                <div className="text-4xl font-bold text-primary-200 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#E0F2FE" />
                    <path
                      d="M17 13L25 20L17 27"
                      stroke="#0EA5E9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
