"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "Inicio", href: "/" },
  { name: "Eventos", href: "/sections" },
  { name: "Cursos", href: "/sections/events/2" },
  { name: "Notificar", href: "/pages/solicitud-user" },
]

export function MainNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground",
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg rounded-b-lg border-t z-50">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 pb-1 border-t border-gray-200 mt-2">
              <div className="flex space-x-2 pt-2">
                <Button asChild size="sm" className="w-full auth-button">
                  <Link href="/pages/login">Iniciar Sesion</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full border-primary/30 text-primary">
                  <Link href="/pages/register">Registrarse</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
