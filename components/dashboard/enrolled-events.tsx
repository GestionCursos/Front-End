import { useEffect, useState } from "react"
import { getDashboardDataUsuario } from "../../app/Services/usuarioService"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select"
import User from "../../app/models/User"
import { formatDate, safeFormatDate } from "../../lib/date-utils"
import { 
  Calendar, 
  Filter, 
  Search,
  Clock,
  Star,
  Users,
  Play,
  CheckCircle,
  MoreVertical,
  MapPin,
  CreditCard,
  FileText,
  Award
} from "lucide-react"

interface EnrolledEventsProps {
  user: User
}

export function EnrolledEvents({ user }: EnrolledEventsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [eventosInscritos, setEventosInscritos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const uid = user.uid_firebase || user.uid
      if (!uid) {
        setLoading(false)
        return
      }
      try {
        const dashboardData = await getDashboardDataUsuario(uid)
        setEventosInscritos(dashboardData.eventosInscritos || [])
      } catch (e) {
        setEventosInscritos([])
      }
      setLoading(false)
    }
    fetchData()
  }, [user])

  const filteredEvents = eventosInscritos.filter(inscripcion => {
    const evento = inscripcion.evento
    const matchesSearch = evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (evento.categoria || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || inscripcion.estadoInscripcion === filterStatus
    return matchesSearch && matchesFilter
  })

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case "progress":
        return (b.progreso || 0) - (a.progreso || 0)
      case "name":
        return a.evento.nombre.localeCompare(b.evento.nombre)
      case "recent":
      default:
        return new Date(b.fechaInscripcion).getTime() - new Date(a.fechaInscripcion).getTime()
    }
  })

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500"
    if (progress >= 75) return "bg-blue-500"
    if (progress >= 50) return "bg-yellow-500"
    return "bg-gray-400"
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "completado":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            <CheckCircle className="h-3 w-3" />
            Completado
          </span>
        )
      case "activo":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            <Play className="h-3 w-3" />
            En Progreso
          </span>
        )
      case "pendiente_pago":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            <CreditCard className="h-3 w-3" />
            Pendiente Pago
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Inactivo
          </span>
        )
    }
  }

  if (loading) return <div className="p-8">Cargando eventos...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Mis Eventos</h1>
        <p className="text-muted-foreground">
          Gestiona y continúa con tus eventos inscritos
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar eventos por nombre, organizador o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="activo">En progreso</SelectItem>
                  <SelectItem value="completado">Completados</SelectItem>
                  <SelectItem value="pendiente_pago">Pendiente pago</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Más recientes</SelectItem>
                  <SelectItem value="progress">Por progreso</SelectItem>
                  <SelectItem value="name">Por nombre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de eventos inscritos */}
      <div className="grid grid-cols-1 gap-6">
        {sortedEvents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No hay eventos</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== "all" 
                  ? "No se encontraron eventos con los filtros seleccionados."
                  : "Aún no te has inscrito en ningún evento."}
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedEvents.map((inscripcion) => (
            <Card key={inscripcion.id_inscripcion} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Imagen del evento */}
                  <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden flex items-center justify-center border border-primary/20 bg-white shadow-sm">
                    {inscripcion.evento.url_foto ? (
                      <img src={inscripcion.evento.url_foto} alt={inscripcion.evento.nombre} className="object-cover w-full h-full" loading="lazy" />
                    ) : (
                      <Calendar className="h-12 w-12 text-primary" />
                    )}
                  </div>
                  {/* Información del evento */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-semibold text-foreground">{inscripcion.evento.nombre}</h3>
                          {getStatusBadge(inscripcion.estado_inscripcion)}
                        </div>
                        <p className="text-muted-foreground">{inscripcion.evento.descripcion}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {inscripcion.organizador}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {inscripcion.evento.modalidad}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {inscripcion.evento.num_horas} horas
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {inscripcion.evento.categoria_area}
                          </span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Inscrito el {safeFormatDate(inscripcion.fecha_inscripcion)}
                        </p>
                        {/* Estado de pago dinámico */}
                        {inscripcion.estado_pago && (
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              inscripcion.estado_pago === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {inscripcion.estado_pago === 'pagado' ? 'Pagado' : 'Pendiente'}
                            </span>
                            {inscripcion.estado_pago === 'pagado' && inscripcion.forma_pago && (
                              <span className="text-xs text-muted-foreground">
                                via {inscripcion.forma_pago}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Progreso y estadísticas */}
                    {inscripcion.estado_inscripcion !== 'pendiente_pago' && (
                      <div className="space-y-3">
                        {/* Barra de asistencia */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Asistencia</span>
                          <span className="font-medium">{inscripcion.porcentaje_asistencia || 0}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300 bg-green-500"
                            style={{ width: `${inscripcion.porcentaje_asistencia || 0}%` }}
                          />
                        </div>
                        {/* Nota final */}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Nota:</span>
                          <span className="font-semibold text-blue-700">{inscripcion.nota !== undefined ? inscripcion.nota : '-'}</span>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-medium text-foreground">${inscripcion.evento.costo}</p>
                            <p className="text-muted-foreground">Costo</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-foreground">{inscripcion.evento.tipo_evento}</p>
                            <p className="text-muted-foreground">Tipo</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Acciones */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                      {inscripcion.estado_inscripcion === 'pendiente_pago' ? (
                        <Button className="auth-button">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Realizar Pago
                        </Button>
                      ) : inscripcion.estado_inscripcion === 'completado' ? (
                        <>
                          <Button variant="outline">
                            <Award className="h-4 w-4 mr-2" />
                            Ver Certificado
                          </Button>
                          <Button variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            Calificaciones
                          </Button>
                        </>
                      ) : (
                        <>
                          
                          <Button variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
