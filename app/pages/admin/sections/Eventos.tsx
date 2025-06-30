"use client";

import { useEffect, useState } from "react";
import { Evento } from "@/app/models/Evento";
import { EventoForm } from "@/components/Eventos/CrearEvento/EventoForm";
import { VistaPrevia } from "@/components/Eventos/CrearEvento/VistaPrevia";
import { useCrearEvento } from "@/components/Eventos/CrearEvento/useCrearEvento";
import { VistaEventos } from "@/components/Eventos/Editar/VistaEventos";
import { eliminarEvento, obtenerEventos } from "@/app/Services/eventoService";
import Event from "@/app/models/Event";
import { ModalMensaje } from "@/components/EventModals";

export default function GestionEventos() {
  const state = useCrearEvento(); // para formulario y vista previa
  const [eventos, setEventos] = useState<Event[]>([]);
  const [editandoEvento, setEditandoEvento] = useState<Evento | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventoAEliminar, setEventoAEliminar] = useState<number | null>(null);


  useEffect(() => {
    const cargarEventos = async () => {
      const res = await obtenerEventos();
      setEventos(res);
    };

    cargarEventos();
  }, []);

  // Handler para editar
  const handleEditar = (evento: Evento) => {
    // setEditandoEvento(evento);
    //state.setFormData(evento);
    //state.setImagenPreview(evento.url_foto || "");
  };

  // Handler para eliminar
  const handleEliminar = (id: number) => {
    setEventoAEliminar(id);
    setModalVisible(true);
  };
  const confirmarEliminacion = async () => {
    if (!eventoAEliminar) return;

    try {
      await eliminarEvento(eventoAEliminar);
      setEventos(prev => prev.filter(e => e.id_evento !== eventoAEliminar));
    } catch (error) {
      console.error("Error al eliminar evento", error);
    } finally {
      setModalVisible(false);
      setEventoAEliminar(null);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Gestión de Eventos</h1>

      {/* Sección de crear o editar evento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <EventoForm {...state} />
        <VistaPrevia formData={state.formData} imagenPreview={state.imagenPreview ?? ""} />
      </div>

      {/* Lista de eventos existentes */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Eventos Existentes</h2>
        <VistaEventos eventos={eventos} onEditar={handleEditar} onEliminar={handleEliminar} />
      </section>
      <ModalMensaje
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        titulo="Advertencia"
        errorMessage="Si eliminas el evento, tienes hasta 2 semanas para contactarte con administración para recuperarlo. En caso contrario, será eliminado permanentemente junto con sus datos."
        onConfirm={confirmarEliminacion}
      />

    </div>
  );
}
