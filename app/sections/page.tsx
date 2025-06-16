"use client"
import Link from "next/link"
import Image from "next/image"
import { SiteLayout } from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Users, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import "../globals.css"
import { EventFilters } from "@/components/ui/filters"
import * as sectionsService from '../Services/sectionsService';

function formatFecha(fechaStr: string) {
  if (!fechaStr) return ""
  const fecha = new Date(fechaStr)
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function formatHora(fechaStr: string) {
  if (!fechaStr) return ""
  const fecha = new Date(fechaStr)
  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export default function SectionsPage() {
  const [secciones, setSecciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const seccionesPorPagina = 6

  const filteredSecciones = secciones
  .filter(seccion =>
    seccion.nombre.toLowerCase().includes(search.toLowerCase()) ||
    seccion.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const totalPaginas = Math.ceil(filteredSecciones.length / seccionesPorPagina)
  const seccionesPaginadas = filteredSecciones.slice((paginaActual - 1) * seccionesPorPagina, paginaActual * seccionesPorPagina)


  // Datos de para secciones
  useEffect(() => {
    async function fetchSecciones() {
      try {
        const secciones = await sectionsService.getSecciones()
        console.log("Secciones recibidas:", secciones)
        setSecciones(Array.isArray(secciones) ? secciones : [])

      } catch (error) {
        setSecciones([])
        console.error("Error al cargar secciones:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSecciones()
  }, [])

  useEffect(() => {
    setPaginaActual(1)
  }, [search])

  // Loader mientras carga
  if (loading) {
    return (
      <SiteLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <span className="text-lg text-muted-foreground">Cargando eventos...</span>
        </div>
      </SiteLayout>
    )
  }

  // Si no hay eventos, mensaje amigable
  if (!secciones.length) {
    return (
      <SiteLayout>
        <section className="container mx-auto py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Secciones</h1>
          <p className="mb-8 text-muted-foreground">No hay secciones disponibles en este momento.</p>
        </section>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl font-bold mb-4">Secciones</h1>
            <p className="text-muted-foreground mb-8">
              Explora nuestras diferentes secciones organizadas para facilitar tu navegación y encontrar exactamente lo
              que necesitas.
            </p>
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

            {/* Contenido principal */}
            <div className="flex-1">
              {/* Secciones organizadas */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Nuestras Secciones</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {seccionesPaginadas.map((seccion) => (
                    <div
                      key={seccion.id_seccion}
                      className="bg-white rounded-xl border border-primary/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="relative h-64">
                        <Image
                          src={seccion.icono_url || "/placeholder.svg"}
                          alt={seccion.nombre}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="mb-2 bg-primary/90 backdrop-blur-sm">{seccion.categoria}</Badge>
                          <h3 className="font-bold text-xl text-white mb-1">{seccion.nombre}</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{seccion.descripcion}</p>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            <div>
                              <p className="text-xs font-medium">Disponible desde</p>
                              <p className="text-sm">
                                {seccion.fechaInicio ? new Date(seccion.fechaInicio).toLocaleDateString() : "Siempre"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            <div>
                              <p className="text-xs font-medium">Modalidad</p>
                              <p className="text-sm">{seccion.modalidad}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">{seccion.tipoEvento || "General"}</span>
                          </div>
                          <Button asChild className="auth-button">
                            <Link href={`/sections/events/${seccion.id_seccion}`}>Explorar Sección</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                <div className="flex justify-center mt-10 gap-2">
                  <button
                    onClick={() => setPaginaActual(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="px-4 py-2 rounded-lg border border-primary/20 text-primary disabled:opacity-50 hover:bg-primary/5 transition-colors"
                  >
                    ← Anterior
                  </button>
                  {Array.from({ length: totalPaginas }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPaginaActual(i + 1)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        paginaActual === i + 1
                          ? "bg-primary text-white border-primary"
                          : "border-primary/20 text-primary hover:bg-primary/5"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPaginaActual(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="px-4 py-2 rounded-lg border border-primary/20 text-primary disabled:opacity-50 hover:bg-primary/5 transition-colors"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Quieres crear una nueva sección?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Si tienes contenido valioso que compartir y quieres crear tu propia sección, podemos ayudarte a organizarla
            y darle visibilidad.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/contact">Contactar</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link href="/section-guide">Guía para crear secciones</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
