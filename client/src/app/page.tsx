"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import FeaturesSection from "@/components/home/FeaturesSection"
import HowItWorksSection from "@/components/home/HowItWorksSection"
import TestimonialSection from "@/components/home/TestimonialSection"
import CtaSection from "@/components/home/CtaSection"
import SimpleHeroSection from "@/components/home/SimpleHeroSection"

// Dynamically import the 3D hero section with no SSR
const HeroSection = dynamic(() => import("@/components/home/HeroSection"), {
  ssr: false,
  loading: () => <SimpleHeroSection />,
})

export default function Home() {
  const [is3DSupported, setIs3DSupported] = useState(true)

  useEffect(() => {
    // Check if WebGL is supported
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setIs3DSupported(!!gl)
    } catch (e) {
      setIs3DSupported(false)
    }
  }, [])

  return (
    <div className="animate-fade-in">
      {is3DSupported ? <HeroSection /> : <SimpleHeroSection />}
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialSection />
      <CtaSection />
    </div>
  )
}
