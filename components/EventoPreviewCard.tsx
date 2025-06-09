// components/EventoPreviewCard.tsx

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Calendar, MapPin } from "lucide-react";
import Image from "next/image";

interface EventoPreviewProps {
  formData: any;
  imagenPreview: string;
}

const EventoPreviewCard: React.FC<EventoPreviewProps> = ({ formData, imagenPreview }) => {
  return (
    <Card className="border shadow-md overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        {imagenPreview ? (
          <Image src={imagenPreview} alt="Preview" fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
        )}
        <Badge className="absolute top-3 left-3">{formData.categoria || "Categoría"}</Badge>
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-bold text-lg line-clamp-1">{formData.nombre || "Título del evento"}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{formData.descripcion || "Descripción del evento..."}</p>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {formData.fechaInicio
              ? `${new Date(formData.fechaInicio).toLocaleDateString()} - ${new Date(formData.fechaFin).toLocaleDateString()}`
              : "Sin fechas"}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {formData.modalidad || "Modalidad"}
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-primary">
            {formData.costo ? `$${formData.costo}` : "Gratis"}
          </span>
          <button className="text-sm underline text-red-500">Ver detalles</button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventoPreviewCard;
