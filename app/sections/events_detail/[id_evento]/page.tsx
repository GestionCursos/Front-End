"use client";
export const runtime = 'edge';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as sectionsService from "../../../Services/sectionsService";
import * as inscripcionService from "@/app/Services/inscripcionService";
import { SiteLayout } from "@/components/site-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import '../../../globals.css'
import StorageNavegador from "@/app/Services/StorageNavegador";
import { LoginRequiredModal, AdminNotAllowedModal, RegistrationSuccessModal, ModalMensaje } from "@/components/EventModals";
import User from "@/app/models/User";
import { calcularDuracion } from "@/app/utils/Funciones";
import { EventoHeader } from "@/components/Eventos/Detalle/EventoHeader";
import { InformacionImportante } from "@/components/Eventos/Detalle/InformacionImportante";
import { FormularioRequisitos } from "@/components/Eventos/Detalle/FormularioRequisitos";
import { DetallesEvento } from "@/components/Eventos/Detalle/DetallesEvento";

export default function DetalleEventoPage() {
  const { id_evento } = useParams();
  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [permisoInscripcion, setPermisoInscripcion] = useState(true);

  //para manejar subida de archivos de acuerdo a los requisitos del evento
  const [mostrarFormularioRequisitos, setMostrarFormularioRequisitos] = useState(false);
  const [archivosRequisitos, setArchivosRequisitos] = useState<{ [key: number]: File | null }>({});


  useEffect(() => {
    async function fetchEvento() {
      try {
        // Busca el evento por ID
        const eventoEncontrado = await sectionsService.getEventoPorId(String(id_evento));
        setEvento(eventoEncontrado);
       
       
      } catch (error) {
        setEvento(null);
      } finally {
        setLoading(false);
      }
    }
    fetchEvento();

    // Detecta el rol del usuario desde localStorage
    const user = StorageNavegador.getItemWithExpiry("user");
    let parsed = null;
    if (user && typeof user === 'string') {
      try {
        parsed = JSON.parse(user);
      } catch {
        parsed = null;
      }
    } else if (user && typeof user === 'object') {
      parsed = user;
    }
    setUserRole(parsed && parsed.rol ? parsed.rol : null);
  }, [id_evento]);

  if (loading) {
    return <SiteLayout><div className="text-center py-16">Cargando evento...</div></SiteLayout>;
  }

  if (!evento) {
    return <SiteLayout><div className="text-center py-16">Evento no encontrado.</div></SiteLayout>;
  }

  const duracionDias = calcularDuracion(evento.fechaInicio, evento.fechaFin)

  const realizarInscripcion = async (urlCedulaPapeletaV: string | null, urlComprobantePago: string | null, cartaMotivacion: string | null) => {
    try {
      // Simula una inscripción o llama a tu backend con los archivos

      inscripcionService.createInscripcion({
        evento: evento.id_evento,
        urlCedula: urlCedulaPapeletaV,
        urlComprobantePago: urlComprobantePago,
        urlCartaMotivacion: cartaMotivacion,
      }).then(() => {
        setShowSuccessModal(true);
      })
        .catch((err) => {
          setErrorMessage("Error al inscribirse: " + (err.message || err));
          setShowErrorModal(true);
        });
    } catch (error) {
      console.error(error);
      setErrorMessage("Hubo un error al realizar la inscripción.");
      setShowErrorModal(true);
    }
  };

  const handleInscribirse = () => {
    if (permisoInscripcion) {
      const usuario = StorageNavegador.getItemWithExpiry("user") as User;
      if (!usuario) {
        setShowLoginModal(true);
        return;
      }

      if (usuario.rol === "admin") {
        setShowAdminModal(true);
        return;
      }

      if (evento.requisitos && evento.requisitos.length > 0) {
        // Mostrar formulario de requisitos
        setMostrarFormularioRequisitos(true);
      } else {
        // Proceder a inscripción directamente
        realizarInscripcion(null, null, null);
      }

      setTimeout(async () => {
      }, 2250);
    } else {
      setShowErrorModal(true)
    }
  };

  return (
    <SiteLayout>
      <div className="container px-4 mx-auto py-8">
        {/* Navegación */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen principal */}
            <EventoHeader
              nombre={evento.nombre}
              urlFoto={evento.urlFoto}
              tipoEvento={evento.tipoEvento}
              categoria={evento.categoria}
              requiereAsistencia={evento.requiereAsistencia}
              descripcion={evento.descripcion}
            />

            {/* Detalles adicionales */}
            <InformacionImportante
              requiereAsistencia={evento.requiereAsistencia}
              notaAprovacion={evento.notaAprovacion}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información del evento */}
            <DetallesEvento
              fechaInicio={evento.fechaInicio}
              fechaFin={evento.fechaFin}
              duracionDias={duracionDias}
              numeroHoras={evento.numeroHoras}
              modalidad={evento.modalidad}
            />

            {/* Precio y registro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Precio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {evento.costo === 0 ? "Gratis" : `$${evento.costo}`}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    {evento.costo === 0 ? "Evento gratuito" : "Precio por persona"}
                  </p>
                  <Button className="w-full" size="lg" onClick={handleInscribirse}>
                    Inscribirse ahora
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">Confirma tu participación</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
      {/* Modal de login requerido */}
      <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
      {/* Modal para administradores */}
      <AdminNotAllowedModal open={showAdminModal} onClose={() => setShowAdminModal(false)} />
      {/* Modal de inscripción exitosa */}
      <RegistrationSuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      {/* Modal de error de inscripción */}
      <ModalMensaje open={showErrorModal} onClose={() => setShowErrorModal(false)} errorMessage={errorMessage} titulo="Error al Inscribirse" />

      {mostrarFormularioRequisitos && (
        <FormularioRequisitos
          requisitos={evento.requisitos}
          archivosRequisitos={archivosRequisitos}
          setArchivosRequisitos={setArchivosRequisitos}
          onEnviar={(urls) => {
            realizarInscripcion(urls[1] || null, urls[2] || null, urls[3] || null);
            setMostrarFormularioRequisitos(false);
          }}
          onCancelar={() => setMostrarFormularioRequisitos(false)}
        />
      )}

    </SiteLayout>
  );
}