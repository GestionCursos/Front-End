'use client';
import '@/app/globals.css';
import { useState } from "react";
import Sidebar from '@/components/ui/Sidebar';
import Inicio from '../sections/Inicio';
import MisionVision from '../sections/MisionVision';
import Autoridade from '../sections/Autoridades';
import Solicitudes from '../sections/Solicitudes';
import SolicitudesAdmin from '../sections/SolicitudesAdmin';
import Eventos from '../sections/Eventos';
import Reportes from '../sections/Reportes';
import Calificacion from '../sections/Calificacion';
import Inscripciones from '../sections/Inscripciones';
import GestionCambio from '../sections/GestionCambio';
import CreacionAdmin from '../sections/CreacionAdmin';
import AdminLayout from '../layout';
import Secciones from '../sections/Secciones';
import EstadisticasACS from '../sections/EstadisticasACS';

const sectionComponents: { [key: string]: React.ReactNode } = {
  dashboard: <Inicio />,
  creacion_admin: <CreacionAdmin />,
  mision_vision: <MisionVision />,
  autoridades: <Autoridade />,
  solicitudes: <Solicitudes />,
  solicitudes_admin: <SolicitudesAdmin />,
  eventos: <Eventos />,
  reportes: <Reportes />,
  calificaciones: <Calificacion />,
  inscripciones: <Inscripciones />,
  gestion_cambio: <GestionCambio />,
  Secciones: <Secciones />,
  estadisticas: <EstadisticasACS />
};

export default function SidebarLayout() {
  return (
    <AdminLayout>
      <SidebarLayou />
    </AdminLayout>
  );
}


function SidebarLayou() {

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
