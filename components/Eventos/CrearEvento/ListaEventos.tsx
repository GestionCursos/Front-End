'use client';
import React from "react";
import { Evento } from "@/app/models/Evento";

interface ListaEventosProps {
  eventos: Evento[];
  onEditar: (evento: Evento) => void;
  onEliminar: (id: number) => void;
}

export function ListaEventos({ eventos, onEditar, onEliminar }: ListaEventosProps) {
  return (
    <div className="space-y-4">
      {eventos.map((evento) => (
        <div key={evento.id_evento} className="border p-4 rounded shadow-sm bg-white">
          <h2 className="text-lg font-bold">{evento.nombre}</h2>
          <p className="text-sm text-gray-600">{evento.descripcion}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEditar(evento)}
              className="text-blue-600 hover:underline"
            >
              Editar
            </button>
            <button
              onClick={() => onEliminar(evento.id_evento)}
              className="text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
