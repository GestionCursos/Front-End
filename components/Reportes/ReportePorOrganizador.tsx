"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Organizador } from "@/app/models/Curso";
import { ReportePDF } from "@/app/pages/admin/sections/script/generarReporte";
import { FileText } from "lucide-react";

interface Props {
  organizador: Organizador[];
}

export const ReportePorOrganizador: React.FC<Props> = ({ organizador }) => {
  const [busqueda, setBusqueda] = useState("");
  const [organizadorSeleccionado, setOrganizadorSeleccionado] = useState<Organizador | null>(null);

  const organizadoresFiltrados = organizador.filter((org) =>
    org.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleGenerarReporte = () => {
    if (!organizadorSeleccionado) return;
    const reporte = new ReportePDF("organizador", organizadorSeleccionado.id);
    reporte.generar();
  };

  return (
    <>
      {/* Título y descripción */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-red-700">Reportes de Organizadores</h2>
        <p className="text-gray-600">
          Busca y selecciona un organizador para generar un reporte de sus cursos.
        </p>
      </div>

      {/* Buscador y lista */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <input
            type="text"
            placeholder="Buscar organizador..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {organizadoresFiltrados.length === 0 ? (
              <p className="text-sm text-gray-500">No se encontraron organizadores.</p>
            ) : (
              organizadoresFiltrados.map((org) => (
                <li
                  key={org.id}
                  onClick={() => setOrganizadorSeleccionado(org)}
                  className={`p-3 border rounded-md cursor-pointer transition-all duration-200 
                    ${organizadorSeleccionado?.id === org.id
                      ? "border-red-500 bg-red-100 text-red-700 font-semibold"
                      : "border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {org.nombre}
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Acción de reporte */}
      {organizadorSeleccionado && (
        <Card>
          <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Organizador seleccionado:</p>
              <p className="text-lg font-bold text-red-700">{organizadorSeleccionado.nombre}</p>
            </div>
            <Button
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
              onClick={handleGenerarReporte}
            >
              <FileText size={18} />
              Generar Reporte
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};
