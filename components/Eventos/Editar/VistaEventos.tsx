'use client';

import React from "react";
import { Evento } from "@/app/models/Evento";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Event from "@/app/models/Event";

interface ListaEventosProps {
    eventos: Event[];
    onEditar: (evento: Evento) => void;
    onEliminar: (id: number) => void;
}

export function VistaEventos({ eventos, onEditar, onEliminar }: ListaEventosProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento) => (
                <Card key={evento.id_evento} className="border shadow-md overflow-hidden relative">
                    <div className="relative h-48 bg-gray-100">
                        {evento.urlFoto ? (
                            <Image
                                src={evento.urlFoto}
                                alt={evento.nombre}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                        )}
                        <Badge className="absolute top-3 left-3 capitalize">{evento.categoria || "Categoría"}</Badge>
                    </div>

                    <CardContent className="p-4 space-y-2">
                        <h3 className="font-bold text-lg line-clamp-1">{evento.nombre}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{evento.descripcion}</p>

                        <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {evento.fechaInicio && evento.fechaFin
                                    ? `${new Date(evento.fechaInicio).toLocaleDateString()} - ${new Date(evento.fechaFin).toLocaleDateString()}`
                                    : "Sin fechas"}
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {evento.modalidad || "Modalidad"}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="font-bold text-primary">{evento.costo ? `$${evento.costo}` : "Gratis"}</span>
                            <div className="flex gap-3">
                                <button onClick={() => onEditar(evento)} className="text-blue-500 hover:text-blue-700">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => onEliminar(evento.id_evento)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
