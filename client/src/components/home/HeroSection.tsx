"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"
import FallbackHeroImage from "./FallbackHeroImage"

function ShoppingCart() {
  const { scene } = useGLTF("/shopping-cart.glb")
  const [modelError, setModelError] = useState(false)

  useEffect(() => {
    if (!scene) {
      console.error("Error loading 3D model")
      setModelError(true)
    }
  }, [scene])

  if (modelError) {
    return null
  }

  return <primitive object={scene} scale={2} position={[0, -1, 0]} />
}

export default function HeroSection() {
  const router = useRouter()
  const [has3DError, setHas3DError] = useState(false)

  // Check if WebGL is supported
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setHas3DError(!gl)
    } catch (e) {
      setHas3DError(true)
    }
  }, [])

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

          {has3DError ? (
            <FallbackHeroImage />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-[400px] lg:h-[500px]"
            >
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }} onError={() => setHas3DError(true)}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <ShoppingCart />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
                <Environment preset="city" />
              </Canvas>
            </motion.div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  )
}
