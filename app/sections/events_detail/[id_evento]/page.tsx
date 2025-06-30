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
  const [estadoInscripcion, setEstadoInscripcion] = useState<"disponible" | "inscrito" | "no_disponible">("disponible");

  //para manejar subida de archivos de acuerdo a los requisitos del evento
  const [mostrarFormularioRequisitos, setMostrarFormularioRequisitos] = useState(false);
  const [archivosRequisitos, setArchivosRequisitos] = useState<{ [key: number]: File | null }>({});


  useEffect(() => {
    async function fetchEvento() {
      try {
        console.log('ID del evento:', id_evento);
        // Busca el evento por ID
        const eventoEncontrado = await sectionsService.getEventoPorId(String(id_evento));
        console.log('Evento encontrado:', eventoEncontrado);
        
        if (!eventoEncontrado) {
          throw new Error('Evento no encontrado en la respuesta del servidor');
        }
        
        setEvento(eventoEncontrado);
        
        // Validar inscripción solo si hay usuario logueado
        try {
          const inscrito = await inscripcionService.validarEstudianteInscrito(Number(id_evento));
          console.log('Resultado validación inscripción:', inscrito);
          if (inscrito && typeof inscrito !== "boolean" && inscrito.mensaje) { 
            setPermisoInscripcion(false); 
            setEstadoInscripcion("inscrito");
            setErrorMessage(inscrito.mensaje);
          } else {
            setEstadoInscripcion("disponible");
          }
        } catch (validationError) {
          console.log('Error en validación de inscripción (usuario posiblemente no logueado):', validationError);
          setEstadoInscripcion("disponible");
          // No bloquear la carga del evento si falla la validación de inscripción
        }
      } catch (error) {
        console.error('Error al buscar evento:', error);
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
    return (
      <SiteLayout>
        <div className="text-center py-16">
          <p>Evento no encontrado.</p>
          <p className="text-sm text-gray-500 mt-2">ID buscado: {id_evento}</p>
          <Button asChild className="mt-4">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const duracionDias = calcularDuracion(evento.fechaInicio, evento.fechaFin)

  const realizarInscripcion = async (urlCedulaPapeletaV: string | null, urlComprobantePago: string | null, cartaMotivacion: string | null) => {
    try {
      // Crear inscripción con los nombres de propiedades correctos según el DTO del backend
      await inscripcionService.createInscripcion({
        evento: evento.id_evento,
        urlCedulaPapeletaV: urlCedulaPapeletaV || undefined, // Convertir null a undefined
        urlComprobantePago: urlComprobantePago || undefined, // Convertir null a undefined
        cartaMotivacion: cartaMotivacion || undefined, // Convertir null a undefined
      });
      
      // Inscripción exitosa
      setShowSuccessModal(true);
      setPermisoInscripcion(false); // Desactivar botón de inscripción
      setEstadoInscripcion("inscrito");
      setErrorMessage("Ya estás inscrito en este evento");
      
    } catch (err: any) {
      console.error('Error al inscribirse:', err);
      setErrorMessage("Error al inscribirse: " + (err.message || err));
      setShowErrorModal(true);
    }
  };

  const handleInscribirse = async () => {
    // Verificar si el usuario está logueado
    const usuario = StorageNavegador.getItemWithExpiry("user") as User;
    if (!usuario) {
      setShowLoginModal(true);
      return;
    }

    // Verificar si es administrador
    if (usuario.rol === "admin") {
      setShowAdminModal(true);
      return;
    }

    // Verificar si ya está inscrito antes de proceder
    try {
      const validacionInscripcion = await inscripcionService.validarEstudianteInscrito(Number(id_evento));
      console.log('Validación antes de inscripción:', validacionInscripcion);
      
      if (validacionInscripcion && typeof validacionInscripcion !== "boolean" && validacionInscripcion.mensaje) {
        // Ya está inscrito o hay algún impedimento
        setPermisoInscripcion(false);
        setEstadoInscripcion("inscrito");
        setErrorMessage(validacionInscripcion.mensaje);
        setShowErrorModal(true);
        return;
      } else {
        setEstadoInscripcion("disponible");
        setPermisoInscripcion(true);
      }
    } catch (validationError) {
      console.log('Error al validar inscripción:', validationError);
      // Si hay error en la validación, permitir continuar pero mostrar advertencia
    }

    // Si llegamos aquí, el usuario puede inscribirse
    if (permisoInscripcion) {
      if (evento.requisitos && evento.requisitos.length > 0) {
        // Mostrar formulario de requisitos
        setMostrarFormularioRequisitos(true);
      } else {
        // Proceder a inscripción directamente
        realizarInscripcion(null, null, null);
      }
    } else {
      setShowErrorModal(true);
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
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleInscribirse}
                    disabled={estadoInscripcion === "inscrito"}
                    variant={estadoInscripcion === "inscrito" ? "secondary" : "default"}
                  >
                    {estadoInscripcion === "inscrito" ? "Ya inscrito" : "Inscribirse ahora"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    {estadoInscripcion === "inscrito" 
                      ? "Ya tienes una inscripción en este evento" 
                      : "Confirma tu participación"}
                  </p>
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