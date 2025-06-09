"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SiteLayout } from "../../../../components/site-layout"
import { UserSidebar } from "../../../../components/ui/user-sidebar"
import { DashboardMain } from "../../../../components/dashboard/dashboard-main"
import { EnrolledEvents } from "../../../../components/dashboard/enrolled-events"
import { PersonalInfo } from "../../../../components/dashboard/personal-info"
import { Certificates } from "../../../../components/dashboard/certificates"
import User from "../../../models/User"
import '../../../globals.css'

export default function DashboardPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

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

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </SiteLayout>
    )
  }
  // if (loading) {
  //   return (
  //     <SiteLayout>
  //       <div className="flex items-center justify-center min-h-screen">
  //         <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
  //       </div>
  //     </SiteLayout>
  //   )
  // }

  // if (!user) {
  //   return null
  // }
  const renderContent = () => {
    if (!user) return null;
    switch (activeSection) {
      case "dashboard":
        return <DashboardMain user={user} />
      case "events":
        return <EnrolledEvents user={user} />
      case "personal":
        return <PersonalInfo user={user} />
      case "certificates":
        return <Certificates user={user} />
      default:
        return <DashboardMain user={user} />
    }
  }

  // Verificación de seguridad para TypeScript
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
      <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
        <UserSidebar 
          active={activeSection} 
          onSelect={setActiveSection}
          user={user}
        />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </SiteLayout>
  )
}
