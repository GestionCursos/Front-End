import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useSolicitudesGenerales } from "./useSolicitudesGenerales";
import SolicitudCardPendiente from "./SolicitudCardPendiente";
import SolicitudCardAprobada from "./SolicitudCardAprobada";
import SolicitudCardImplementando from "./SolicitudCardImplementando";
import SolicitudCardFinalizada from "./SolicitudCardFinalizada";

export default function SolicitudesAdmin() {
  const { solicitudes, loading, refetch } = useSolicitudesGenerales();
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Filtrado por estado y búsqueda
  const solicitudesFiltradas = solicitudes.filter((sol) => {
    const matchEstado = estado ? sol.estado === estado : true;
    const matchSearch = search.trim()
      ? (
          (sol.idUser?.nombres + " " + sol.idUser?.apellidos).toLowerCase().includes(search.toLowerCase()) ||
          sol.idUser?.correo?.toLowerCase().includes(search.toLowerCase()) ||
          sol.apartado?.toLowerCase().includes(search.toLowerCase()) ||
          sol.tipoCambio?.toLowerCase().includes(search.toLowerCase()) ||
          sol.justificacion?.toLowerCase().includes(search.toLowerCase())
        )
      : true;
    return matchEstado && matchSearch;
  });

  // Renderiza la card según el estado de la solicitud, solo visualización y bloquea acciones con overlay
  const renderCard = (solicitud: any) => {
    return (
      <div key={solicitud.idSolicitud} className="relative">
        {/* Card según estado */}
        {(() => {
          switch (solicitud.estado) {
            case "Pendiente":
              return <SolicitudCardPendiente solicitud={solicitud} />;
            case "Aprobado":
              return <SolicitudCardAprobada solicitud={solicitud} />;
            case "Implementando":
              return <SolicitudCardImplementando solicitud={solicitud} />;
            case "Completado":
            case "Cancelado":
            case "Rechazado":
              return <SolicitudCardFinalizada solicitud={solicitud} onFilterChange={() => {}} />;
            default:
              return null;
          }
        })()}
        {/* Overlay para bloquear interacción */}
        <div className="absolute inset-0 bg-white bg-opacity-60 cursor-not-allowed z-20" style={{borderRadius: '1.5rem'}} />
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      <h1 className="text-2xl font-bold mb-4 text-red-700">Solicitudes (Vista solo Admin)</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, correo, apartado, tipo, justificación..."
          className="w-full md:w-1/2 px-4 py-2 border-2 border-red-200 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-red-100 text-base placeholder-gray-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="w-full md:w-1/4 px-4 py-2 border-2 border-gray-200 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-gray-100 text-base"
          value={estado}
          onChange={e => setEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Implementando">Implementando</option>
          <option value="Completado">Completado</option>
          <option value="Cancelado">Cancelado</option>
          <option value="Rechazado">Rechazado</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <CircularProgress color="error" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {solicitudesFiltradas.length === 0 ? (
            <div>No hay solicitudes registradas.</div>
          ) : (
            solicitudesFiltradas.map(renderCard)
          )}
        </div>
      )}
    </div>
  );
}
