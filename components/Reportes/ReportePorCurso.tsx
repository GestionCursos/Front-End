"use client";

import React, { useState } from "react";
import { Curso } from "@/app/models/Curso";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportePDF } from "@/app/pages/admin/sections/script/generarReporte";
import { FileText } from "lucide-react";

interface Props {
  cursos: Curso[];
}

export const ReportePorCurso: React.FC<Props> = ({ cursos }) => {
  const [busqueda, setBusqueda] = useState("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);

  const cursosFiltrados = cursos.filter((curso) =>
    curso.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleGenerarReporte = () => {
    if (!cursoSeleccionado) return;
    const reporte = new ReportePDF("curso", cursoSeleccionado.id_evento);
    reporte.generar();
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-red-700">Reportes de Cursos</h2>
        <p className="text-gray-600">Selecciona un curso para generar su reporte detallado.</p>
      </div>

      {/* Buscador y Lista de cursos */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <input
            type="text"
            placeholder="Buscar curso..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
          />

          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {cursosFiltrados.length === 0 ? (
              <p className="text-gray-500 text-sm">No se encontraron cursos.</p>
            ) : (
              cursosFiltrados.map((curso) => (
                <li
                  key={curso.id_evento}
                  className={`p-3 border rounded-md cursor-pointer transition-all duration-200 
                  ${cursoSeleccionado?.id_evento === curso.id_evento
                      ? "border-red-500 bg-red-100 text-red-700 font-semibold"
                      : "border-gray-300 hover:bg-gray-100"
                    }`}
                  onClick={() => setCursoSeleccionado(curso)}
                >
                  {curso.nombre}
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Reporte generado */}
      {cursoSeleccionado && (
        <Card>
          <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-gray-500 text-sm">Curso seleccionado:</p>
              <p className="text-lg font-bold text-red-700">{cursoSeleccionado.nombre}</p>
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
