
"use client"

import { useState, useEffect } from "react"
import { History as HistoryIcon, Calendar, MapPin, CheckCircle2, AlertTriangle, ChevronRight, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/context/LanguageContext"
import { LanguageToggle } from "@/components/LanguageToggle"
import { cn } from "@/lib/utils"

interface LogEntry {
  id: number
  time: string
  location: string
  status: "success" | "failed"
}

export default function HistoryPage() {
  const { t } = useLanguage()
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("sos_history")
    if (saved) {
      setLogs(JSON.parse(saved))
    } else {
      const mock = [
        { id: 1, time: "2024-05-15 22:15", location: "40.7128° N, 74.0060° W", status: "success" },
        { id: 2, time: "2024-04-10 14:30", location: "Unknown Location", status: "failed" }
      ]
      setLogs(mock as any)
      localStorage.setItem("sos_history", JSON.stringify(mock))
    }
  }, [])

  return (
    <div className="p-6 space-y-8 max-w-md mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">{t.history_title}</h1>
          <p className="text-muted-foreground uppercase text-xs font-bold">{t.past_alerts}</p>
        </div>
        <LanguageToggle />
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder={t.search_records} 
          className="rounded-2xl h-12 bg-card border-none pl-12 focus-visible:ring-primary"
        />
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-border">
            <HistoryIcon size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="font-bold uppercase text-muted-foreground">{t.no_records}</p>
            <p className="text-xs text-muted-foreground/60 px-8 mt-2">{t.no_records_desc}</p>
          </div>
        ) : (
          logs.map((log) => (
            <Card key={log.id} className="rounded-3xl border-none bg-card overflow-hidden active:bg-accent/5 transition-colors cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  log.status === "success" ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                )}>
                  {log.status === "success" ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-black uppercase text-muted-foreground flex items-center gap-1">
                      <Calendar size={10} /> {log.time}
                    </p>
                    <Badge variant="outline" className={cn(
                      "text-[8px] uppercase font-black px-1.5 py-0 border-none",
                      log.status === "success" ? "bg-green-500/20 text-green-500" : "bg-primary/20 text-primary"
                    )}>
                      {log.status}
                    </Badge>
                  </div>
                  <div className="flex items-start gap-1">
                    <MapPin size={12} className="mt-0.5 text-muted-foreground shrink-0" />
                    <p className="font-bold uppercase text-sm truncate">{log.location}</p>
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground/40" size={20} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
