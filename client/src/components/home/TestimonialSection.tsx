"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Marco Bianchi",
    role: "Padre di famiglia",
    content:
      "Da quando uso RisparmiApp risparmio circa 30€ a settimana sulla spesa. È incredibile quanto si possa risparmiare conoscendo tutte le offerte disponibili!",
    rating: 5,
  },
  {
    id: 2,
    name: "Giulia Rossi",
    role: "Studentessa",
    content:
      "Con il budget limitato da studentessa, RisparmiApp è diventata essenziale per me. Riesco a trovare le migliori offerte senza perdere tempo a cercare tra i volantini.",
    rating: 5,
  },
  {
    id: 3,
    name: "Antonio Verdi",
    role: "Pensionato",
    content:
      "App semplice da usare anche per chi come me non è molto pratico con la tecnologia. Mi aiuta a risparmiare sulla spesa settimanale.",
    rating: 4,
  },
]

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cosa dicono i nostri utenti</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Migliaia di persone risparmiano ogni giorno grazie a RisparmiApp.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <motion.div
              key={testimonials[currentIndex].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-primary-50 p-8 rounded-xl"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonials[currentIndex].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-lg text-gray-700 italic mb-6">"{testimonials[currentIndex].content}"</p>

              <div>
                <p className="font-semibold text-gray-900">{testimonials[currentIndex].name}</p>
                <p className="text-gray-600">{testimonials[currentIndex].role}</p>
              </div>
            </motion.div>

            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                aria-label="Testimonianza precedente"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-primary-600" : "bg-gray-300"}`}
                    aria-label={`Testimonianza ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                aria-label="Testimonianza successiva"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
