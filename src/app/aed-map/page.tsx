
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, Zap, MapPin, Navigation, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/LanguageContext"
import { cn } from "@/lib/utils"

interface AEDLocation {
  id: string
  name: string
  distance: string
  address: string
  x: number // simulated map coordinate %
  y: number // simulated map coordinate %
}

export default function AEDMapPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAED, setSelectedAED] = useState<AEDLocation | null>(null)

  // Mock AED locations
  const aedLocations: AEDLocation[] = [
    { id: "1", name: "Subway Station Exit A", distance: "120m", address: "Central Plaza B1", x: 45, y: 35 },
    { id: "2", name: "Community Health Center", distance: "350m", address: "North Wing 1F", x: 65, y: 55 },
    { id: "3", name: "Fitness World Lobby", distance: "500m", address: "Gym Reception", x: 25, y: 75 },
    { id: "4", name: "Main Street Pharmacy", distance: "800m", address: "Front Counter", x: 75, y: 25 },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between bg-gradient-to-b from-background via-background/80 to-transparent">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-2xl bg-card/80 backdrop-blur-md shadow-lg"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-black uppercase tracking-tight">{t.aed_map_title}</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{t.nearby_aed}</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Map View */}
      <div className="flex-1 relative bg-muted/20">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
            <p className="font-black uppercase text-sm text-muted-foreground animate-pulse">{t.scanning_aed}</p>
          </div>
        ) : (
          <>
            {/* Simulated Map Grid/Image */}
            <Image 
              src="https://picsum.photos/seed/map4/800/1200" 
              alt="Map" 
              fill 
              className="object-cover opacity-40 grayscale contrast-125"
              data-ai-hint="city map"
            />
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px]" />
            
            {/* AED Markers */}
            {aedLocations.map((aed) => (
              <button
                key={aed.id}
                onClick={() => setSelectedAED(aed)}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                  selectedAED?.id === aed.id ? "scale-125 z-40" : "scale-100 z-30"
                )}
                style={{ left: `${aed.x}%`, top: `${aed.y}%` }}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-2 transition-colors",
                  selectedAED?.id === aed.id 
                    ? "bg-emerald-500 border-white text-white" 
                    : "bg-background border-emerald-500 text-emerald-500"
                )}>
                  <Zap size={20} className="fill-current" />
                </div>
                {selectedAED?.id === aed.id && (
                  <div className="absolute top-full mt-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter whitespace-nowrap shadow-lg">
                    {aed.distance}
                  </div>
                )}
              </button>
            ))}

            {/* User Pointer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-2xl animate-pulse" />
              <div className="absolute inset-0 w-12 h-12 -m-3 rounded-full border border-blue-500/30 animate-ping" />
            </div>
          </>
        )}
      </div>

      {/* Bottom Panel */}
      <div className="z-50 bg-background/80 backdrop-blur-xl border-t border-white/5 rounded-t-[2.5rem] p-6 space-y-6 shadow-2xl">
        {!selectedAED ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black uppercase tracking-tight">{t.found_aed}</h2>
              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-500 border-none uppercase font-black text-[10px]">
                {aedLocations.length} Devices
              </Badge>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {aedLocations.map((aed) => (
                <Card 
                  key={aed.id} 
                  className="min-w-[160px] rounded-3xl border-none bg-card/50 cursor-pointer active:scale-95 transition-transform"
                  onClick={() => setSelectedAED(aed)}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <Zap size={16} fill="currentColor" />
                    </div>
                    <p className="font-black uppercase text-[11px] truncate">{aed.name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold">{aed.distance}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Zap size={32} fill="currentColor" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black uppercase truncate leading-none">{selectedAED.name}</h3>
                  <Badge variant="outline" className="bg-emerald-500 text-white border-none uppercase text-[9px] font-black">
                    {selectedAED.distance}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-bold uppercase mt-2 flex items-center gap-1">
                  <MapPin size={10} /> {selectedAED.address}
                </p>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">Status: Operational</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-tight shadow-xl shadow-emerald-900/20"
                onClick={() => setSelectedAED(null)}
              >
                <Navigation size={18} className="mr-2" /> {t.view_on_map}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 rounded-2xl border-white/10 bg-card"
              >
                <Info size={20} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
