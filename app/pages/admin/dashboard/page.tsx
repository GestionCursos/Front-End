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
import AuditDashboard from '../sections/AuditDashboard';

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
  estadisticas: <EstadisticasACS />,
  auditoria: <AuditDashboard />
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f8f4ee]">

      {/* Botón hamburguesa visible solo en móvil */}
      <div className="md:hidden p-4 bg-white shadow-md flex justify-between items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
          className="text-gray-700 focus:outline-none"
        >
          {/* Icono hamburguesa simple */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M3 12h18M3 6h18M3 18h18"></path>
          </svg>
        </button>
        <h1 className="font-semibold text-lg">Mi Aplicación</h1>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md
        transform md:transform-none
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <Sidebar
          active={activeSection}
          onSelect={(section) => {
            setActiveSection(section);
            setSidebarOpen(false); // Cierra sidebar en móvil al seleccionar
          }}
        />
      </aside>

      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Contenido principal */}
      <main className="flex-1 p-8 overflow-y-auto md:ml-64" style={{ marginLeft: "0px" }}>
        {sectionComponents[activeSection] ?? <p>Sección no encontrada</p>}
      </main>
    </div >
  );
}
