
"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/LanguageContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10">
          <Globe size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl bg-card border-border">
        <DropdownMenuItem 
          onClick={() => setLanguage('en')}
          className={`font-bold uppercase text-xs p-3 cursor-pointer ${language === 'en' ? 'text-primary' : ''}`}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('cn')}
          className={`font-bold uppercase text-xs p-3 cursor-pointer ${language === 'cn' ? 'text-primary' : ''}`}
        >
          简体中文
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
