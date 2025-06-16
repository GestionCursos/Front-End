"use client";
import { useCrearEvento } from "@/components/CrearEvento/useCrearEvento";
import { EventoForm } from "@/components/CrearEvento/EventoForm";
import { VistaPrevia } from "@/components/CrearEvento/VistaPrevia";

export default function CrearEvento() {
  const state = useCrearEvento();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Crear Nuevo Evento</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <EventoForm {...state} />
        <VistaPrevia formData={state.formData} imagenPreview={state.imagenPreview??""} />
      </div>
    </div>
  );
}