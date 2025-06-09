import React from "react";
import EventoPreviewCard from "@/components/EventoPreviewCard";
import { Evento } from "@/app/models/CrearEvento";

interface Props {
  formData: Evento;
  imagenPreview: string;
}

export const VistaPrevia: React.FC<Props> = ({ formData, imagenPreview }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-fit">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Vista Previa</h2>
      <EventoPreviewCard formData={formData} imagenPreview={imagenPreview} />
    </div>
  );
};
