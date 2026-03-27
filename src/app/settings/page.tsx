
"use client"

import { useState, useEffect } from "react"
import { Shield, Smartphone, MapPin, Radio, BellRing, Info } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/context/LanguageContext"
import { LanguageToggle } from "@/components/LanguageToggle"

export default function SettingsPage() {
  const { t } = useLanguage()
  const [settings, setSettings] = useState({
    autoSms: true,
    autoCall: false,
    liveLocation: true,
    loopAlerts: false,
    riskLevel: "medium"
  })

  useEffect(() => {
    const saved = localStorage.getItem("emergency_settings")
    if (saved) setSettings(JSON.parse(saved))
  }, [])

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("emergency_settings", JSON.stringify(newSettings))
  }

  return (
    <div className="p-6 space-y-8 max-w-md mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">{t.settings_title}</h1>
          <p className="text-muted-foreground uppercase text-xs font-bold">{t.emergency_behavior}</p>
        </div>
        <LanguageToggle />
      </header>

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
            <Smartphone size={14} /> {t.automatic_actions}
          </h2>
          <div className="space-y-3">
            {[
              { id: "autoSms", label: t.send_auto_sms, icon: BellRing, desc: t.auto_sms_desc },
              { id: "autoCall", label: t.auto_call, icon: Shield, desc: t.auto_call_desc },
              { id: "liveLocation", label: t.live_location, icon: MapPin, desc: t.live_location_desc },
              { id: "loopAlerts", label: t.loop_alerts, icon: Radio, desc: t.loop_alerts_desc }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-5 bg-card rounded-3xl border border-border/50">
                <div className="space-y-1">
                  <Label htmlFor={item.id} className="text-base font-bold uppercase block cursor-pointer">
                    {item.label}
                  </Label>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase">{item.desc}</p>
                </div>
                <Switch 
                  id={item.id} 
                  checked={(settings as any)[item.id]} 
                  onCheckedChange={(val) => updateSetting(item.id, val)} 
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
            <Shield size={14} /> {t.danger_level}
          </h2>
          <RadioGroup 
            value={settings.riskLevel} 
            onValueChange={(val) => updateSetting("riskLevel", val)}
            className="grid grid-cols-1 gap-3"
          >
            {[
              { value: "low", label: t.low_risk, desc: t.low_risk_desc, color: "bg-green-500" },
              { value: "medium", label: t.medium_risk, desc: t.medium_risk_desc, color: "bg-yellow-500" },
              { value: "high", label: t.high_risk, desc: t.high_risk_desc, color: "bg-primary" }
            ].map((level) => (
              <div key={level.value} className="relative">
                <RadioGroupItem value={level.value} id={level.value} className="peer sr-only" />
                <Label
                  htmlFor={level.value}
                  className="flex items-center gap-4 p-5 rounded-3xl border-2 border-transparent bg-card peer-data-[state=checked]:border-primary transition-all cursor-pointer"
                >
                  <div className={`w-3 h-3 rounded-full ${level.color}`} />
                  <div>
                    <p className="font-black uppercase">{level.label}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{level.desc}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </section>

        <Card className="rounded-3xl border-none bg-accent/10">
          <CardContent className="p-5 flex gap-4">
            <Info className="text-accent shrink-0" size={20} />
            <div className="space-y-1">
              <p className="text-xs font-black uppercase text-accent">{t.privacy_note}</p>
              <p className="text-[10px] leading-relaxed font-medium uppercase text-accent/80">
                {t.privacy_desc}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
