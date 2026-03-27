
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { ChevronRight, ShieldCheck, MapPin, Bell } from "lucide-react"

const slides = [
  {
    title: "Instant SOS Help",
    description: "In an emergency, one long press is all it takes to notify your trusted contacts and get help.",
    icon: ShieldCheck,
    image: PlaceHolderImages.find(img => img.id === "onboarding-1"),
  },
  {
    title: "Location Tracking",
    description: "Automatically share your precise location so responders can find you exactly where you are.",
    icon: MapPin,
    image: PlaceHolderImages.find(img => img.id === "onboarding-2"),
  },
  {
    title: "Always Protected",
    description: "Customize risk levels and notification frequency. We need location and notification permissions to keep you safe.",
    icon: Bell,
    image: PlaceHolderImages.find(img => img.id === "onboarding-3"),
  },
]

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const onboarded = localStorage.getItem("onboarded")
    if (onboarded) {
      router.replace("/")
    }
  }, [router])

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      localStorage.setItem("onboarded", "true")
      router.push("/")
    }
  }

  const slide = slides[currentSlide]
  const Icon = slide.icon

  return (
    <div className="flex min-h-screen flex-col bg-background text-white p-6 max-w-md mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-12">
        <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-border/50">
          {slide.image && (
            <Image
              src={slide.image.imageUrl}
              alt={slide.image.description}
              fill
              className="object-cover"
              data-ai-hint={slide.image.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
        </div>

        <div className="space-y-4 px-4">
          <div className="inline-flex p-3 rounded-full bg-primary/20 text-primary mb-2">
            <Icon size={32} />
          </div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">{slide.title}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {slide.description}
          </p>
        </div>
      </div>

      <div className="space-y-6 pb-8">
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
        <Button
          onClick={nextSlide}
          size="lg"
          className="w-full h-14 text-lg font-bold uppercase tracking-wide rounded-2xl"
        >
          {currentSlide === slides.length - 1 ? "Start Being Safe" : "Next"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
