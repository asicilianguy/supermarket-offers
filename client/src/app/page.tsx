import FeaturesSection from "@/components/home/FeaturesSection"
import HowItWorksSection from "@/components/home/HowItWorksSection"
import TestimonialSection from "@/components/home/TestimonialSection"
import CtaSection from "@/components/home/CtaSection"
import SimpleHeroSection from "@/components/home/SimpleHeroSection"

export default function Home() {
  return (
    <div className="animate-fade-in">
      <SimpleHeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialSection />
      <CtaSection />
    </div>
  )
}
