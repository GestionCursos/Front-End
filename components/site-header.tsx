import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { useEffect, useState } from "react"
import StorageNavegador from "@/app/Services/StorageNavegador"

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    // Verifica si hay usuario en localStorage
    const user = StorageNavegador.getItemWithExpiry("user")
    setIsLoggedIn(!!user)
    let parsed = null;
    if (user && typeof user === 'string') {
      try {
        parsed = JSON.parse(user)
      } catch {
        parsed = null
      }
    } else if (user && typeof user === 'object') {
      parsed = user
    }
    setUserType(parsed && parsed.rol ? parsed.rol : null)
    setUserName(parsed && parsed.nombre ? parsed.nombre : null)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/10 bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="font-bold text-xl logo-text">EduEvents</span>
            </div>
          </Link>
        </div>
        <MainNav />
        {!isLoggedIn && (
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
              <Link href="/pages/login">Iniciar Sesion</Link>
            </Button>
            <Button asChild className="auth-button">
              <Link href="/pages/register">Registrarse</Link>
            </Button>
          </div>
        )}
        {isLoggedIn && (
          <div className="hidden md:flex items-center space-x-4">
            {userName && (
              <span className="font-semibold text-primary">Hola, {userName}</span>
            )}
            {userType === 'estudiante' ? (
              <Button asChild className="auth-button">
                <Link href="/pages/client/dashboard">Panel Cliente</Link>
              </Button>
            ) : userType === 'admin' ? (
              <Button asChild className="auth-button">
                <Link href="/pages/admin/dashboard">Panel Admin</Link>
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </header>
  )
}
