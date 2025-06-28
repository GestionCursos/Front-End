"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SiteLayout } from "../../../../components/site-layout"
import { UserSidebar } from "../../../../components/ui/user-sidebar"
import { DashboardMain } from "../../../../components/dashboard/dashboard-main"
import { EnrolledEvents } from "../../../../components/dashboard/enrolled-events"
import { PersonalInfo } from "../../../../components/dashboard/personal-info"
import { Certificates } from "../../../../components/dashboard/certificates"
import { Menu, X } from "lucide-react" // iconos
import User from "../../../models/User"
import '../../../globals.css'

export default function DashboardPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setUser(parsed.data ? parsed.data : parsed)
        } catch {
          setUser(null)
        }
      }
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/pages/login")
  }

  const handleSectionSelect = (section: string) => {
    setActiveSection(section)
    setIsSidebarOpen(false) // cerrar sidebar en móvil al seleccionar
  }

  if (!mounted) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </SiteLayout>
    )
  }

  const renderContent = () => {
    if (!user) return null;
    switch (activeSection) {
      case "dashboard":
        return <DashboardMain user={user} />
      case "events":
        return <EnrolledEvents user={user} />
      case "personal":
        return <PersonalInfo />
      case "certificates":
        return <Certificates user={user} />
      default:
        return <DashboardMain user={user} />
    }
  }

  if (!user) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p>Cargando usuario...</p>
          </div>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      {/* Sidebar móvil como drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div
            className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Menú</h2>
              <button onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <UserSidebar
              active={activeSection}
              onSelect={handleSectionSelect}
              user={user}
            />
          </div>
        </div>
      )}

      {/* Layout principal */}
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-gray-50">
        {/* Sidebar fijo en escritorio */}
        <div className="hidden md:block md:w-64 border-r border-gray-200">
          <UserSidebar
            active={activeSection}
            onSelect={handleSectionSelect}
            user={user}
          />
        </div>

        {/* Contenido principal */}
        <main className="flex-1 p-4 md:p-8">
          {/* Botón hamburguesa visible solo en móvil */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 text-primary font-medium"
            >
              <Menu className="h-5 w-5" />
              Menú
            </button>
          </div>

          {renderContent()}
        </main>
      </div>
    </SiteLayout>
  )
}