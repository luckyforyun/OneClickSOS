
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Users, Settings, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/LanguageContext"

export function Navigation() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    { href: "/", label: t.nav_sos, icon: Shield },
    { href: "/contacts", label: t.nav_contacts, icon: Users },
    { href: "/history", label: t.nav_history, icon: History },
    { href: "/settings", label: t.nav_settings, icon: Settings },
  ]

  if (pathname === "/onboarding") return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/80 backdrop-blur-lg pb-safe-area-inset-bottom">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
