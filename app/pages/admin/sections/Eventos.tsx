"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useCrearEvento } from "@/components/CrearEvento/useCrearEvento";
import { EventoForm } from "@/components/CrearEvento/EventoForm";
import { VistaPrevia } from "@/components/CrearEvento/VistaPrevia";
import { EditarEventoForm } from "@/components/Eventos/EditarEvento/EditarEventoForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Calendar, DollarSign, Users, MapPin, Search, Filter, X } from "lucide-react";
import * as sectionsService from "@/app/Services/sectionsService";
import { formatFecha } from "@/app/utils/Funciones";
import Image from "next/image";

export default function Eventos() {
  const [activeTab, setActiveTab] = useState("lista");
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventoEditando, setEventoEditando] = useState<number | null>(null);
  const [fechaHoy, setFechaHoy] = useState("");
  const state = useCrearEvento();

  // Estados para filtros
  const [filtros, setFiltros] = useState({
    busqueda: "",
    tipoEvento: "",
    modalidad: "",
    categoria: "",
    fechaDesde: "",
    fechaHasta: "",
    soloEditables: false
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Inicializar fecha de hoy
  useEffect(() => {
    setFechaHoy(new Date().toISOString().split('T')[0]);
  }, []);

  // Función para verificar si un evento puede editarse
  const puedeEditarse = useCallback((fechaInicio: string) => {
    const fecha = new Date(fechaInicio);
    const ahora = new Date();
    return fecha > ahora;
  }, []);

  // Eventos filtrados
  const eventosFiltrados = useMemo(() => {
    if (!eventos.length) return [];

    return eventos.filter((evento) => {
      // Filtro por búsqueda (nombre)
      if (filtros.busqueda && !evento.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase())) {
        return false;
      }

      // Filtro por tipo de evento
      if (filtros.tipoEvento && evento.tipoEvento !== filtros.tipoEvento) {
        return false;
      }

      // Filtro por modalidad
      if (filtros.modalidad && evento.modalidad !== filtros.modalidad) {
        return false;
      }

      // Filtro por categoría
      if (filtros.categoria && evento.categoria !== filtros.categoria) {
        return false;
      }

      // Filtro por fecha desde
      if (filtros.fechaDesde) {
        const fechaEvento = new Date(evento.fechaInicio);
        const fechaDesde = new Date(filtros.fechaDesde);
        if (fechaEvento < fechaDesde) {
          return false;
        }
      }

      // Filtro por fecha hasta
      if (filtros.fechaHasta) {
        const fechaEvento = new Date(evento.fechaInicio);
        const fechaHasta = new Date(filtros.fechaHasta);
        if (fechaEvento > fechaHasta) {
          return false;
        }
      }

      // Filtro solo editables
      if (filtros.soloEditables && !puedeEditarse(evento.fechaInicio)) {
        return false;
      }

      return true;
    });
  }, [eventos, filtros, puedeEditarse]);

  // Obtener valores únicos para los selectores
  const tiposEvento = useMemo(() => 
    [...new Set(eventos.map(e => e.tipoEvento))].filter(Boolean), 
    [eventos]
  );
  const modalidades = useMemo(() => 
    [...new Set(eventos.map(e => e.modalidad))].filter(Boolean), 
    [eventos]
  );
  const categorias = useMemo(() => 
    [...new Set(eventos.map(e => e.categoria))].filter(Boolean), 
    [eventos]
  );

  // Verificar si hay filtros activos
  const hayFiltrosActivos = useMemo(() => {
    return filtros.busqueda || 
           filtros.tipoEvento || 
           filtros.modalidad || 
           filtros.categoria || 
           filtros.fechaDesde || 
           filtros.fechaHasta || 
           filtros.soloEditables;
  }, [filtros]);

  // Funciones para manejar filtros
  const limpiarFiltros = useCallback(() => {
    setFiltros({
      busqueda: "",
      tipoEvento: "",
      modalidad: "",
      categoria: "",
      fechaDesde: "",
      fechaHasta: "",
      soloEditables: false
    });
  }, []);

  const aplicarFiltroRapido = useCallback((filtro: string, valor: any) => {
    setFiltros(prev => ({ ...prev, [filtro]: valor }));
  }, []);

  const aplicarFiltroDesdeHoy = useCallback(() => {
    if (fechaHoy) {
      setFiltros(prev => ({ ...prev, fechaDesde: fechaHoy }));
    }
  }, [fechaHoy]);

  // Cargar eventos
  const cargarEventos = async () => {
    try {
      setLoading(true);
      const eventosData = await sectionsService.getTodosLosEventos();
      setEventos(eventosData || []);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const handleEventoCreado = () => {
    cargarEventos();
    setActiveTab("lista");
  };

  const handleEventoActualizado = () => {
    cargarEventos();
    setEventoEditando(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-700">Gestión de Eventos</h1>
        <Button 
          onClick={() => setActiveTab("crear")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Crear Nuevo Evento
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de Eventos</TabsTrigger>
          <TabsTrigger value="crear">Crear Evento</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Eventos Existentes
                  <Badge variant="secondary" className="ml-2">
                    {eventosFiltrados.length} de {eventos.length}
                  </Badge>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                  {hayFiltrosActivos && (
                    <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      !
                    </Badge>
                  )}
                </Button>
              </div>
              
              {/* Panel de filtros */}
              {mostrarFiltros && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  {/* Filtros rápidos */}
                  <div className="mb-4 pb-4 border-b">
                    <Label className="text-sm font-medium mb-2 block">Filtros rápidos</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => aplicarFiltroRapido('soloEditables', true)}
                        className="text-xs"
                      >
                        Solo editables
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => aplicarFiltroRapido('tipoEvento', 'GRATUITO')}
                        className="text-xs"
                      >
                        Eventos gratuitos
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => aplicarFiltroRapido('modalidad', 'PRESENCIAL')}
                        className="text-xs"
                      >
                        Presenciales
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => aplicarFiltroRapido('modalidad', 'VIRTUAL')}
                        className="text-xs"
                      >
                        Virtuales
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={aplicarFiltroDesdeHoy}
                        className="text-xs"
                      >
                        Desde hoy
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Búsqueda por nombre */}
                    <div className="space-y-2">
                      <Label htmlFor="busqueda">Buscar por nombre</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="busqueda"
                          placeholder="Buscar eventos..."
                          value={filtros.busqueda}
                          onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Filtro por tipo de evento */}
                    <div className="space-y-2">
                      <Label>Tipo de evento</Label>
                      <Select
                        value={filtros.tipoEvento || "todos"}
                        onValueChange={(value) => setFiltros(prev => ({ ...prev, tipoEvento: value === "todos" ? "" : value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos los tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos los tipos</SelectItem>
                          {tiposEvento.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filtro por modalidad */}
                    <div className="space-y-2">
                      <Label>Modalidad</Label>
                      <Select
                        value={filtros.modalidad || "todas"}
                        onValueChange={(value) => setFiltros(prev => ({ ...prev, modalidad: value === "todas" ? "" : value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todas las modalidades" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas las modalidades</SelectItem>
                          {modalidades.map((modalidad) => (
                            <SelectItem key={modalidad} value={modalidad}>
                              {modalidad}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filtro por categoría */}
                    <div className="space-y-2">
                      <Label>Categoría</Label>
                      <Select
                        value={filtros.categoria || "todas"}
                        onValueChange={(value) => setFiltros(prev => ({ ...prev, categoria: value === "todas" ? "" : value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todas las categorías" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas las categorías</SelectItem>
                          {categorias.map((categoria) => (
                            <SelectItem key={categoria} value={categoria}>
                              {categoria}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filtro por fecha desde */}
                    <div className="space-y-2">
                      <Label htmlFor="fechaDesde">Fecha desde</Label>
                      <Input
                        id="fechaDesde"
                        type="date"
                        value={filtros.fechaDesde}
                        onChange={(e) => setFiltros(prev => ({ ...prev, fechaDesde: e.target.value }))}
                      />
                    </div>

                    {/* Filtro por fecha hasta */}
                    <div className="space-y-2">
                      <Label htmlFor="fechaHasta">Fecha hasta</Label>
                      <Input
                        id="fechaHasta"
                        type="date"
                        value={filtros.fechaHasta}
                        onChange={(e) => setFiltros(prev => ({ ...prev, fechaHasta: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Filtros adicionales y acciones */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <input
                        id="soloEditables"
                        type="checkbox"
                        checked={filtros.soloEditables}
                        onChange={(e) => setFiltros(prev => ({ ...prev, soloEditables: e.target.checked }))}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="soloEditables" className="text-sm font-medium">
                        Solo eventos editables
                      </Label>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={limpiarFiltros}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Limpiar filtros
                    </Button>
                  </div>
                </div>
              )}

              {/* Resumen de filtros activos */}
              {!mostrarFiltros && hayFiltrosActivos && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <Filter className="h-4 w-4" />
                      <span>Filtros activos:</span>
                      <div className="flex flex-wrap gap-1">
                        {filtros.busqueda && (
                          <Badge variant="secondary" className="text-xs">
                            Búsqueda: "{filtros.busqueda}"
                          </Badge>
                        )}
                        {filtros.tipoEvento && (
                          <Badge variant="secondary" className="text-xs">
                            Tipo: {filtros.tipoEvento}
                          </Badge>
                        )}
                        {filtros.modalidad && (
                          <Badge variant="secondary" className="text-xs">
                            Modalidad: {filtros.modalidad}
                          </Badge>
                        )}
                        {filtros.categoria && (
                          <Badge variant="secondary" className="text-xs">
                            Categoría: {filtros.categoria}
                          </Badge>
                        )}
                        {filtros.fechaDesde && (
                          <Badge variant="secondary" className="text-xs">
                            Desde: {filtros.fechaDesde}
                          </Badge>
                        )}
                        {filtros.fechaHasta && (
                          <Badge variant="secondary" className="text-xs">
                            Hasta: {filtros.fechaHasta}
                          </Badge>
                        )}
                        {filtros.soloEditables && (
                          <Badge variant="secondary" className="text-xs">
                            Solo editables
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={limpiarFiltros}
                      className="text-blue-700 hover:text-blue-900 text-xs"
                    >
                      Limpiar
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : eventosFiltrados.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  {eventos.length === 0 ? (
                    <p>No hay eventos creados</p>
                  ) : (
                    <div>
                      <p>No se encontraron eventos con los filtros aplicados</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={limpiarFiltros}
                        className="mt-2"
                      >
                        Limpiar filtros
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {eventosFiltrados.map((evento) => (
                    <Card key={evento.id_evento} className="hover:shadow-lg transition-shadow">
                      <div className="relative h-32 w-full">
                        <Image
                          src={evento.urlFoto || "/placeholder.svg"}
                          alt={evento.nombre}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant={evento.tipoEvento === "GRATUITO" ? "secondary" : "default"}>
                            {evento.tipoEvento}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {evento.nombre}
                        </h3>
                        
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatFecha(evento.fechaInicio)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{evento.modalidad}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>{evento.costo === 0 ? "Gratis" : `$${evento.costo}`}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <Badge variant="outline">
                            {evento.categoria}
                          </Badge>
                          
                          {puedeEditarse(evento.fechaInicio) ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEventoEditando(evento.id_evento)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Editar
                            </Button>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              No editable
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crear" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <EventoForm {...state} />
            <VistaPrevia formData={state.formData} imagenPreview={state.imagenPreview ?? ""} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de edición */}
      {eventoEditando && (
        <EditarEventoForm
          eventoId={eventoEditando}
          onClose={() => setEventoEditando(null)}
          onSuccess={handleEventoActualizado}
        />
      )}
    </div>
  );
}
