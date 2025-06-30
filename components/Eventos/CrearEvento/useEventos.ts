'use client';
import { useState, useEffect } from "react";
import { Evento } from "@/app/models/Evento";
import {
  obtenerEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} from "@/app/Services/eventoService";

export function useEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const cargarEventos = async () => {
    const lista = await obtenerEventos();
    setEventos(lista);
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const handleCrear = async (data: Omit<Evento, "id">) => {
    await crearEvento(data);
    await cargarEventos();
  };

  const handleActualizar = async (data: Partial<Evento>) => {
    if (!eventoSeleccionado) return;
    await actualizarEvento(eventoSeleccionado.id_evento, data);
    setEventoSeleccionado(null);
    setModoEdicion(false);
    await cargarEventos();
  };

  const handleEliminar = async (id: number) => {
    await eliminarEvento(id);
    await cargarEventos();
  };

  return {
    eventos,
    eventoSeleccionado,
    setEventoSeleccionado,
    handleCrear,
    handleActualizar,
    handleEliminar,
    modoEdicion,
    setModoEdicion,
  };
}
