
"use client"

import { useState, useEffect } from "react"
import { Plus, UserPlus, Phone, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/LanguageContext"
import { LanguageToggle } from "@/components/LanguageToggle"
import { cn } from "@/lib/utils"

interface Contact {
  id: string
  name: string
  phone: string
  isPrimary: boolean
}

export default function ContactsPage() {
  const { t } = useLanguage()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newPhone, setNewPhone] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("emergency_contacts")
    if (saved) {
      setContacts(JSON.parse(saved))
    } else {
      const initial = [
        { id: "1", name: "Mom", phone: "123-456-7890", isPrimary: true },
        { id: "2", name: "Spouse", phone: "098-765-4321", isPrimary: false }
      ]
      setContacts(initial)
      localStorage.setItem("emergency_contacts", JSON.stringify(initial))
    }
  }, [])

  const addContact = () => {
    if (!newName || !newPhone) return
    const newContact: Contact = {
      id: Date.now().toString(),
      name: newName,
      phone: newPhone,
      isPrimary: contacts.length === 0
    }
    const updated = [...contacts, newContact]
    setContacts(updated)
    localStorage.setItem("emergency_contacts", JSON.stringify(updated))
    setNewName("")
    setNewPhone("")
    setIsAddOpen(false)
  }

  const deleteContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id)
    setContacts(updated)
    localStorage.setItem("emergency_contacts", JSON.stringify(updated))
  }

  const togglePrimary = (id: string) => {
    const updated = contacts.map(c => ({
      ...c,
      isPrimary: c.id === id
    }))
    setContacts(updated)
    localStorage.setItem("emergency_contacts", JSON.stringify(updated))
  }

  return (
    <div className="p-6 space-y-8 max-w-md mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">{t.contacts_title}</h1>
          <p className="text-muted-foreground uppercase text-xs font-bold">{t.trusted_circle}</p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl h-12 w-12 bg-primary text-white p-0">
                <Plus size={24} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border rounded-3xl w-[90%] mx-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black uppercase">{t.add_contact}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">{t.name}</label>
                  <Input 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Mom" 
                    className="rounded-xl h-12 bg-muted/50 border-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">{t.phone_number}</label>
                  <Input 
                    value={newPhone} 
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. 123-456-7890" 
                    className="rounded-xl h-12 bg-muted/50 border-none"
                  />
                </div>
                <Button onClick={addContact} className="w-full h-14 rounded-2xl text-lg font-bold uppercase mt-4">
                  {t.save_contact}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-border">
            <UserPlus size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="font-bold uppercase text-muted-foreground">{t.no_contacts}</p>
            <p className="text-xs text-muted-foreground/60 px-8 mt-2">{t.no_contacts_desc}</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <Card key={contact.id} className="rounded-3xl border-none bg-card overflow-hidden group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-2xl uppercase">
                  {contact.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black uppercase truncate">{contact.name}</h3>
                    {contact.isPrimary && (
                      <Badge variant="outline" className="text-[9px] uppercase font-black tracking-tighter bg-primary/20 text-primary border-none">
                        {t.primary}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground font-medium flex items-center gap-1">
                    <Phone size={12} /> {contact.phone}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("rounded-xl h-10 w-10", contact.isPrimary ? "text-primary" : "text-muted-foreground/40 hover:text-primary")}
                    onClick={() => togglePrimary(contact.id)}
                  >
                    <Star size={18} fill={contact.isPrimary ? "currentColor" : "none"} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl h-10 w-10 text-muted-foreground/40 hover:text-destructive"
                    onClick={() => deleteContact(contact.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
