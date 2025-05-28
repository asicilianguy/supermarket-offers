"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function FallbackHeroImage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative h-[400px] lg:h-[500px] flex items-center justify-center"
    >
      <div className="relative w-full h-full">
        <Image
          src="/placeholder.svg?height=500&width=500&query=shopping cart with groceries"
          alt="Shopping cart with groceries"
          fill
          className="object-contain"
          priority
        />
      </div>
    </motion.div>
  )
}
