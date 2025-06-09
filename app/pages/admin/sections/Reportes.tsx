"use client";

import React, { useEffect, useState } from "react";
import { getEventos } from "@/app/Services/reporteService";
import { getOrganizadores } from "@/app/Services/organizadorService";
import { Card, CardContent } from "@/components/ui/card";
import { Curso, Organizador } from "@/app/models/Curso";
import { ReportePorCurso } from "@/components/Reportes/ReportePorCurso";
import { ReportePorOrganizador } from "@/components/Reportes/ReportePorOrganizador";

export default function Reportes() {
  const [tipoReporte, setTipoReporte] = useState("curso");
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [organizadores, setOrganizadores] = useState<Organizador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataCursos = await getEventos();
        const dataOrganizadores = await getOrganizadores();
        setCursos(dataCursos);
        setOrganizadores(dataOrganizadores);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-red-700 mb-2">Reportes</h1>
      <p className="text-gray-600 mb-6">
        Visualiza información detallada por curso o por organizador
      </p>

      {/* Selector de tipo de reporte */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de reporte:
          </label>
          <select
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="curso">Por curso</option>
            <option value="organizador">Por organizador</option>
          </select>
        </CardContent>
      </Card>

      {/* Contenido del reporte */}
      <Card>
        <CardContent className="p-4">
          {loading ? (
            <p className="text-center text-gray-500">Cargando datos...</p>
          ) : tipoReporte === "curso" ? (
            <ReportePorCurso cursos={cursos} />
          ) : (
            <ReportePorOrganizador organizador={organizadores} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
