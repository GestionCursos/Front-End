// SidebarLayout.tsx
'use client';
import '@/app/globals.css';
import { useState } from "react";
import Sidebar from '@/components/ui/Sidebar';
import Inicio from './sections/Inicio';
import MisionVision from './sections/MisionVision';
import Autoridade from './sections/Autoridades';
import Solicitudes from './sections/Solicitudes';
import StorageNavegador from '@/app/Services/StorageNavegador';
import { useRouter } from "next/navigation"

const sectionComponents: { [key: string]: React.ReactNode } = {
  dashboard: <Inicio />,
  mision_vision: <MisionVision />,
  autoridades: <Autoridade />,
  solicitudes: <Solicitudes />
};

export default function SidebarLayout() {
  const router = useRouter()

  setTimeout(() => {
    const user = StorageNavegador.getItemWithExpiry("user");
    if (!user || user && typeof user === "object" && "rol" in user && (user as any).rol !== "admin") {
      router.push("/")
    }
  })
  const [activeSection, setActiveSection] = useState("dashboard");

  return (

    <div className="flex h-screen bg-[#f8f4ee]">
      <Sidebar active={activeSection} onSelect={setActiveSection} />
      <main className="flex-1 p-8 overflow-y-auto">
        {sectionComponents[activeSection] ?? <p>Sección no encontrada</p>}
      </main>
    </div>
  );
}
