"use client";
import Link from "next/link"
import Image from "next/image"
import { SiteLayout } from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  Star,
  BookOpen,
} from "lucide-react"
import { useEffect, useState } from "react"
import '../../../globals.css'
import * as sectionsService from "../../../Services/sectionsService";
import { EventFilters } from "@/components/ui/filters";
import { useParams } from "next/navigation";

function formatFecha(fechaStr: string) {
  if (!fechaStr) return "";
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatHora(fechaStr: string) {
  if (!fechaStr) return "";
  const fecha = new Date(fechaStr);
  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function EventsPage() {

  const params = useParams();
  console.log("Todos los params:", params); // 🔍 Ver todos los parámetros
  console.log("params.id:", params.id); // 🔍 Ver específicamente el id
  console.log("URL actual:", window.location.pathname); // 🔍 Ver la URL completa
  const idSeccion = params.id as string;
  const [seccion, setSeccion] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoriasLoading, setCategoriasLoading] = useState(true);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);
  const [modalidad, setModalidad] = useState("");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [precioSeleccionado, setPrecioSeleccionado] = useState<{ min: number; max: number | null }>({ min: 0, max: null });
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [modalidades, setModalidades] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const eventosPorPagina = 6;
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [tiposEvento, setTiposEvento] = useState<string[]>([]);
  const [tiposEventoSeleccionados, setTiposEventoSeleccionados] = useState<string[]>([]);

  const filteredEvents = events.filter(event =>
    event.nombre.toLowerCase().includes(search.toLowerCase()) ||
    event.categoria.toLowerCase().includes(search.toLowerCase()) ||
    (event.descripcion && event.descripcion.toLowerCase().includes(search.toLowerCase()))
  )
  .filter(event =>
    categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(event.categoria?.toLowerCase())
  )
  .filter(event =>
    !modalidad || event.modalidad?.toLowerCase() === modalidad.toLowerCase()
  )
  .filter(event => {
    if (precioSeleccionado.min > 0 && event.costo < precioSeleccionado.min) return false;
    if (precioSeleccionado.max !== null && event.costo > precioSeleccionado.max) return false;
    return true;
  })
  .filter(event => {
    // Filtro de fechas
    if (fechaInicio && new Date(event.fechaInicio) < new Date(fechaInicio)) return false;
    if (fechaFin && new Date(event.fechaFin) > new Date(fechaFin)) return false;
    return true;
  })
  .filter(event =>
    tiposEventoSeleccionados.length === 0 || tiposEventoSeleccionados.includes(event.tipoEvento)
  );

  const totalPaginas = Math.ceil(filteredEvents.length / eventosPorPagina);
  const eventosPaginados = filteredEvents.slice(
    (paginaActual - 1) * eventosPorPagina,
    paginaActual * eventosPorPagina
  );
  
  const filters = [
    {
      key: "Categoria" as const,
      label: "Categoría",
      options: categorias,
      type: "checkbox" as const,
    },
    {
      key: "Modalidad" as const,
      label: "Modalidad", 
      options: modalidades,
      type: "radio" as const,
    },
    {
      key: "Precio" as const,
      label: "Precio",
      options: [],
      type: "range" as const,
    },
    {
      key: "Fecha" as const,
      label: "Fecha",
      options: [], // No necesitas opciones aquí
      type: "date" as const,
    },
    {
      key: "TipoEvento" as const,
      label: "Tipo de Evento",
      options: tiposEvento, // Lo definimos abajo
      type: "checkbox" as const,
    },
  ];


  // Datos de para eventos
  useEffect(() => {
    console.log("idSeccion recibido:", idSeccion);

    async function fetchSeccion() {
      try {
        const secciones = await sectionsService.getSecciones();
        const found = secciones.find(s => s.id_seccion.toString() === idSeccion);
        
        if (found) {
          setSeccion(found);
          
          // ✅ Usar fechaEliminacion (no fecha_eliminacion)
          const eventosDeEstaSeccion = found.eventos.filter(e => e.visible && !e.fechaEliminacion);
          setEvents(eventosDeEstaSeccion);
  
          // Extraer filtros solo de los eventos de esta sección
          const categoriasUnicas = [...new Set(
            eventosDeEstaSeccion
              .map(evento => evento.categoria)
              .filter(categoria => categoria && typeof categoria === 'string')
              .map(categoria => categoria.trim().toLowerCase())
          )];
          setCategorias(categoriasUnicas);
  
          const modalidadesUnicas = [...new Set(
            eventosDeEstaSeccion
              .map(evento => evento.modalidad)
              .filter(modalidad => modalidad && typeof modalidad === 'string')
              .map(modalidad => modalidad.trim().toLowerCase())
          )];
          setModalidades(modalidadesUnicas);
  
          // ✅ Usar tipoEvento (no tipo_evento)
          const tiposEventoUnicos = [...new Set(
            eventosDeEstaSeccion
              .map(evento => evento.tipoEvento)
              .filter(tipoEvento => tipoEvento && typeof tipoEvento === 'string')
              .map(tipoEvento => tipoEvento.trim())
          )];
          setTiposEvento(tiposEventoUnicos);
        }
      } catch (error) {
        console.error("Error fetching seccion:", error);
        setSeccion({ eventos: [] });
        setEvents([]);
      } finally {
        setLoading(false);
        setCategoriasLoading(false);
      }
    }
  
    if (idSeccion && idSeccion !== 'undefined') { 
      fetchSeccion();
    }
  }, [idSeccion]);
  
  

  useEffect(() => {
    // Limpiar filtros al cambiar de sección
    setCategoriasSeleccionadas([]);
    setModalidad("");
    setPrecioSeleccionado({ min: 0, max: null });
    setPrecioMin("");
    setPrecioMax("");
    setFechaInicio("");
    setFechaFin("");
    setTiposEventoSeleccionados([]);
    setSearch("");
  }, [idSeccion]);

  
  useEffect(() => {
    setPaginaActual(1);
  }, [search, categoriasSeleccionadas, modalidad, precioSeleccionado])

    // Loader mientras carga
  if (loading) {
    return (
      <SiteLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <span className="text-lg text-muted-foreground">Cargando eventos...</span>
        </div>
      </SiteLayout>
    );
  }

  // Si no hay eventos, mensaje amigable
  if (!events.length) {
    return (
      <SiteLayout>
        <section className="container mx-auto py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Eventos</h1>
          <p className="mb-8 text-muted-foreground">
            No hay eventos disponibles en este momento. ¡Vuelve pronto!
          </p>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Volver a secciones
                </Link>
            </Button>
          </div>  
          
            {/* ✅ Solo la barra de búsqueda, sin botón de filtros */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Buscar eventos..." 
                  className="pl-10 auth-input" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/*Filtros siempre visibles*/}
          <div className="flex gap-8">
            {/* Sidebar de filtros siempre visible */}
            <div className="w-80 flex-shrink-0">
              {categoriasLoading ? (
                <div className="text-center py-4">Cargando filtros...</div>
              ) : (
                <EventFilters
                  openFilter={openFilter}
                  setOpenFilter={setOpenFilter}
                  categoriasSeleccionadas={categoriasSeleccionadas}
                  setCategoriasSeleccionadas={setCategoriasSeleccionadas}
                  modalidad={modalidad}
                  setModalidad={setModalidad}
                  precioSeleccionado={precioSeleccionado}
                  setPrecioSeleccionado={setPrecioSeleccionado}
                  precioMin={precioMin}
                  setPrecioMin={setPrecioMin}
                  precioMax={precioMax}
                  setPrecioMax={setPrecioMax}
                  fechaInicio={fechaInicio}
                  setFechaInicio={setFechaInicio}
                  fechaFin={fechaFin}
                  setFechaFin={setFechaFin}
                  tiposEventoSeleccionados={tiposEventoSeleccionados}
                  setTiposEventoSeleccionados={setTiposEventoSeleccionados}
                  filters={filters}
                />
              )}
            </div>

            {/* Contenido principal */}
            <div className="flex-1">
              {/* Todos los eventos */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Todos los eventos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventosPaginados.map((event) => (
                    <Card key={event.id_evento} className="bg-white rounded-lg border border-primary/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={event.urlFoto || "/placeholder.svg"}
                          alt={event.nombre}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-4 left-4 bg-primary">{event.categoria}</Badge>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-2 line-clamp-1">{event.nombre}</h3>
                        <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{event.descripcion}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            <div>
                              <p className="font-medium">
                                {event.fechaInicio
                                  ? new Date(event.fechaInicio).toLocaleDateString() +
                                    " " +
                                    new Date(event.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : "Sin fecha"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="text-sm">{event.modalidad}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">{event.costo ? `$${event.costo}` : "Gratis"}</span>
                          <Button asChild className="auth-button">
                            <Link href={`/sections/events_detail/${event.id_evento}`}>Ver detalles</Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-center mt-10 gap-2">
                  <button onClick={() => setPaginaActual(paginaActual -1)}
                    disabled={paginaActual === 1}
                    className="px-3 py-1 rounded border text-primary disabled:opacity-50">
                      &lt;
                  </button>
                  {Array.from({ length: totalPaginas }, (_, i) => (
                    <button key={i +1} onClick={() => setPaginaActual(i + 1)} 
                    className={`px-3 py-1 rounded border ${paginaActual === i + 1 ? 'bg-red-600 text-white' : 'text-primary'}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPaginaActual(paginaActual + 1)} disabled = {paginaActual === totalPaginas}
                    className="px-3 py-1 rounded border text-primary disabled:opacity-50">
                      &gt;
                  </button>
                </div>

              </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Quieres organizar un evento?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Si eres un experto en tu campo y quieres compartir tu conocimiento, podemos ayudarte a organizar y promover
            tu evento.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/contact">Contactar</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link href="/host-guide">Guía para organizadores</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}