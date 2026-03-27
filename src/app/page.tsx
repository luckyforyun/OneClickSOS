
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, AlertCircle, X, CheckCircle2, Loader2, Phone, MessageSquare, ShieldCheck, Users, Play, PhoneCall, Image as LucideImage, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/LanguageContext"
import { LanguageToggle } from "@/components/LanguageToggle"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export default function Home() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [pressProgress, setPressProgress] = useState(0)
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [location, setLocation] = useState<{ city: string; coords: string } | null>(null)
  const [locationStatus, setLocationStatus] = useState<"pending" | "success" | "failed">("pending")
  const [cancelTimeout, setCancelTimeout] = useState<number>(0)
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const cancelIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const cprImage = PlaceHolderImages.find(img => img.id === "guide-cpr")
  const aedImage = PlaceHolderImages.find(img => img.id === "guide-aed")

  useEffect(() => {
    // Check onboarding
    const onboarded = typeof window !== 'undefined' ? localStorage.getItem("onboarded") : null
    if (!onboarded) {
      router.replace("/onboarding")
    }

    // Get location
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            city: t.current_location,
            coords: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
          })
          setLocationStatus("success")
        },
        () => setLocationStatus("failed")
      )
    }
  }, [router, t.current_location])

  const triggerEmergency = useCallback(() => {
    setIsEmergencyActive(true)
    setCancelTimeout(5)
    
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 500])
    }

    cancelIntervalRef.current = setInterval(() => {
      setCancelTimeout((prev) => {
        if (prev <= 1) {
          if (cancelIntervalRef.current) clearInterval(cancelIntervalRef.current)
          sendSOS()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const sendSOS = () => {
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setIsSuccess(true)
      
      const history = JSON.parse(localStorage.getItem("sos_history") || "[]")
      history.unshift({
        id: Date.now(),
        time: new Date().toLocaleString(),
        location: location?.coords || "Unknown",
        status: "success"
      })
      localStorage.setItem("sos_history", JSON.stringify(history))
    }, 2000)
  }

  const cancelSOS = () => {
    if (cancelIntervalRef.current) clearInterval(cancelIntervalRef.current)
    setIsEmergencyActive(false)
    setIsSending(false)
    setIsSuccess(false)
    setCancelTimeout(0)
    setPressProgress(0)
  }

  const handlePressStart = () => {
    if (isEmergencyActive) return
    setIsLongPressing(true)
    setPressProgress(0)
    
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50)
    }

    progressIntervalRef.current = setInterval(() => {
      setPressProgress((prev) => {
        if (prev >= 100) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current!)
          triggerEmergency()
          return 100
        }
        return prev + 2 
      })
    }, 30)
  }

  const handlePressEnd = () => {
    if (isEmergencyActive) return
    setIsLongPressing(false)
    if (!isEmergencyActive) setPressProgress(0)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
  }

  return (
    <div className={cn(
      "min-h-screen flex flex-col p-6 transition-colors duration-700",
      isEmergencyActive ? "bg-red-950/20 animate-emergency-flash" : "bg-background"
    )}>
      <header className="flex justify-between items-center py-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <ShieldCheck className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-primary leading-none">{t.sos_title}</h1>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">{t.ready}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden xs:block">
            <p className="text-[10px] text-muted-foreground font-bold uppercase">{t.local_time}</p>
            <p className="text-sm font-black tabular-nums">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8 pb-8">
        {!isEmergencyActive ? (
          <>
            <div className="text-center space-y-3 max-w-[280px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-black uppercase tracking-tight leading-tight">{t.need_help}</h2>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide opacity-80">{t.long_press}</p>
            </div>

            <div className="relative">
              {!isLongPressing && (
                <>
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
                  <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse-ring [animation-delay:1s]" />
                </>
              )}
              
              <button
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                className={cn(
                  "relative w-72 h-72 rounded-full flex flex-col items-center justify-center transition-all duration-300 z-10",
                  "bg-gradient-to-br from-[#FF5F6D] to-[#FFC371] text-white shadow-[0_0_60px_rgba(255,95,109,0.4)]",
                  isLongPressing ? "scale-110" : "animate-breathe scale-100",
                  "active:scale-105"
                )}
              >
                <div className="relative z-20 flex flex-col items-center px-6 text-center">
                  <div className="mb-4 relative">
                    <PhoneCall size={64} className={cn("transition-transform duration-300", isLongPressing && "scale-110")} />
                    <div className="absolute -top-1 -right-1 flex gap-0.5">
                      <div className="w-1 h-3 bg-white/40 rounded-full rotate-45 animate-pulse" />
                      <div className="w-1 h-3 bg-white/60 rounded-full rotate-45 animate-pulse delay-75" />
                    </div>
                  </div>
                  <span className="text-3xl font-black uppercase tracking-tight leading-tight mb-2 drop-shadow-md">
                    {t.sos_button}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-tight opacity-90 drop-shadow-sm">
                    {t.sos_subtitle}
                  </span>
                </div>
                
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle
                    cx="144"
                    cy="144"
                    r="140"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="879.64"
                    strokeDashoffset={879.64 - (879.64 * pressProgress) / 100}
                    className="transition-all duration-75"
                  />
                </svg>
              </button>
            </div>

            <div className="w-full max-w-sm flex flex-col gap-3">
              <div className="w-full p-4 rounded-[2rem] bg-card/40 border border-white/5 backdrop-blur-sm flex items-center gap-4 shadow-xl">
                <div className={cn(
                  "p-3 rounded-2xl transition-colors duration-500",
                  locationStatus === "success" ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                )}>
                  <MapPin size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t.current_location}</p>
                  <p className="font-black truncate uppercase text-sm mt-0.5">{location?.city || t.finding_location}</p>
                  <p className="text-[10px] font-mono text-muted-foreground/60 tracking-tighter mt-0.5">{location?.coords || "0.0000, 0.0000"}</p>
                </div>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  locationStatus === "success" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-primary animate-pulse"
                )} />
              </div>

              <Link href="/aed-map" className="w-full">
                <Button className="w-full h-16 rounded-[2rem] bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-500 border border-emerald-500/30 font-black uppercase tracking-tight flex items-center justify-center gap-3">
                  <Zap size={24} className="fill-emerald-500" />
                  <span>{t.nearby_aed}</span>
                </Button>
              </Link>
            </div>

            <div className="w-full max-w-sm space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              <div className="flex items-center gap-2 px-1">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Play size={12} className="text-white fill-white ml-0.5" />
                </div>
                <h3 className="font-black uppercase text-sm tracking-tight">{t.sos_videos}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 group cursor-pointer active:scale-95 transition-transform">
                  <div className="aspect-[4/3] rounded-3xl bg-card overflow-hidden border border-white/5 relative">
                    {cprImage ? (
                      <>
                        <Image 
                          src={cprImage.imageUrl} 
                          alt={cprImage.description} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                          data-ai-hint={cprImage.imageHint}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                            <Play size={20} fill="white" className="text-white ml-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-muted animate-pulse" />
                    )}
                  </div>
                  <p className="font-black uppercase text-[11px] px-1 tracking-tight">{t.cpr_title}</p>
                </div>
                <div className="space-y-2 group cursor-pointer active:scale-95 transition-transform">
                  <div className="aspect-[4/3] rounded-3xl bg-card overflow-hidden border border-white/5 relative">
                    {aedImage ? (
                      <>
                        <Image 
                          src={aedImage.imageUrl} 
                          alt={aedImage.description} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                          data-ai-hint={aedImage.imageHint}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                            <Play size={20} fill="white" className="text-white ml-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-muted animate-pulse" />
                    )}
                  </div>
                  <p className="font-black uppercase text-[11px] px-1 tracking-tight">{t.aed_title}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full max-w-sm space-y-8 animate-in zoom-in-95 fade-in duration-500">
            <div className="text-center space-y-6">
              <div className="relative mx-auto w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                <div className="relative w-full h-full rounded-full bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(255,51,51,0.6)]">
                  {isSuccess ? (
                    <CheckCircle2 size={64} className="text-white animate-in zoom-in duration-300" />
                  ) : isSending ? (
                    <Loader2 size={64} className="text-white animate-spin" />
                  ) : (
                    <AlertCircle size={64} className="text-white" />
                  )}
                </div>
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tight leading-tight drop-shadow-lg">
                {isSuccess ? t.help_on_way : isSending ? t.sending_sos : t.preparing_sos}
              </h2>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-card/80 border-2 border-primary/50 backdrop-blur-md shadow-2xl space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className={cn(
                    "p-3 rounded-2xl transition-all duration-500", 
                    isSending || isSuccess ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "bg-primary text-white"
                  )}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t.location_share}</p>
                    <p className="font-black uppercase text-sm mt-0.5">{isSending || isSuccess ? t.location_attached : t.awaiting_trigger}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl transition-all duration-500", 
                    isSuccess ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "bg-primary text-white"
                  )}>
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t.emergency_contacts}</p>
                    <p className="font-black uppercase text-sm mt-0.5">{isSuccess ? t.notifications_sent : t.ready_to_alert}</p>
                  </div>
                </div>
              </div>

              {cancelTimeout > 0 && !isSending && !isSuccess && (
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span>{t.auto_sending}</span>
                    <span className="text-primary font-mono text-base">{cancelTimeout}S</span>
                  </div>
                  <Progress value={(cancelTimeout / 5) * 100} className="h-3 bg-white/5 overflow-hidden rounded-full" />
                </div>
              )}

              <Button
                variant="outline"
                onClick={cancelSOS}
                className="w-full h-16 rounded-2xl border-2 border-white/10 text-lg font-black uppercase tracking-[0.1em] hover:bg-primary/10 transition-all hover:scale-[1.02] active:scale-95"
              >
                <X className="mr-2 h-6 w-6" /> {t.cancel_sos}
              </Button>
            </div>
            
            {(isSending || isSuccess) && (
              <div className="flex gap-4 animate-in slide-in-from-bottom-8 duration-700">
                <Button className="flex-1 h-16 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 font-black uppercase tracking-tight shadow-xl shadow-blue-900/20 group">
                  <Phone className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" /> {t.call_911}
                </Button>
                <Button className="flex-1 h-16 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-tight shadow-xl shadow-emerald-900/20 group">
                  <MessageSquare className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5" /> {t.quick_sms}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <AlertCircle size={800} className="absolute -top-1/4 -right-1/4" />
      </div>
    </div>
  )
}
