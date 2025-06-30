import { useEffect, useState } from "react"
import { getDashboardDataUsuario } from "../../app/Services/usuarioService"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import User from "../../app/models/User"
import { isValid, parseISO } from "date-fns"
import { 
  Calendar, 
  Award, 
  TrendingUp,
  Clock,
  GraduationCap,
  UserCheck,
} from "lucide-react"

interface DashboardMainProps {
  user: User
}

export function DashboardMain({ user }: DashboardMainProps) {
  const [dashboardStats, setDashboardStats] = useState({
    eventosInscritos: 0,
    eventosCompletados: 0,
    certificadosObtenidos: 0,
    horasTotales: 0,
    asistenciasRegistradas: 0,
    notasAprobatorias: 0
  })
  const [eventosRecientes, setEventosRecientes] = useState<any[]>([])
  const [proximosEventos, setProximosEventos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true)
      const uid = user.uid_firebase || user.uid
      if (!uid) {
        if (isMounted) setLoading(false)
        return
      }
      try {
        const dashboardData = await getDashboardDataUsuario(uid)
        if (!isMounted) return
        const inscripciones = dashboardData.eventosInscritos || []
        setDashboardStats({
          eventosInscritos: inscripciones.length,
          eventosCompletados: inscripciones.filter((i:any) => i.estado_inscripcion === 'Aprobado' || i.estado_inscripcion === 'Completado').length,
          certificadosObtenidos: dashboardData.user.certificados,
          horasTotales: inscripciones.reduce((sum:any, i:any) => sum + (i.evento?.num_horas || 0), 0),
          asistenciasRegistradas: inscripciones.reduce((sum:any, i:any) => sum + (i.porcentaje_asistencia || 0), 0),
          notasAprobatorias: inscripciones.filter((i:any) => i.nota && i.nota >= 70).length
        })
        setEventosRecientes(inscripciones.slice(0, 3).map((i:any) => ({
          ...i.evento,
          estadoInscripcion: i.estado_inscripcion || '',
          asistencias: i.porcentaje_asistencia,
          nota_final: i.nota
        })))
        setProximosEventos(inscripciones.filter((i:any) => new Date(i.evento.fecha_inicio) > new Date()).map((i:any) => ({
          ...i.evento,
          estadoInscripcion: i.estado_inscripcion || '',
          asistencias: i.porcentaje_asistencia,
          nota_final: i.nota
        })))
      } catch (e) {
        if (!isMounted) return
        setDashboardStats({
          eventosInscritos: 0,
          eventosCompletados: 0,
          certificadosObtenidos: 0,
          horasTotales: 0,
          asistenciasRegistradas: 0,
          notasAprobatorias: 0
        })
        setEventosRecientes([])
        setProximosEventos([])
      }
      if (isMounted) setLoading(false)
    }
    fetchData()
    return () => { isMounted = false }
  }, [user])

  // Reemplaza el uso directo de toLocaleDateString por una función segura
  function safeFormatDate(dateValue: any) {
    if (!dateValue) return "-";
    let dateObj = typeof dateValue === "string" ? parseISO(dateValue) : dateValue;
    if (!isValid(dateObj)) return "-";
    return dateObj.toLocaleDateString();
  }

  if (loading) return <div className="p-8">Cargando dashboard...</div>

  return (
    <div className="space-y-8">      {/* Header de bienvenida */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          ¡Bienvenido de vuelta, {user.nombres || user.username || "Usuario"}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Continúa tu aprendizaje donde lo dejaste y descubre nuevos eventos
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-primary/20 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eventos Inscritos</p>
                <p className="text-3xl font-bold text-primary">{dashboardStats.eventosInscritos}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completados</p>
                <p className="text-3xl font-bold text-green-600">{dashboardStats.eventosCompletados}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Certificados</p>
                <p className="text-3xl font-bold text-yellow-600">{dashboardStats.certificadosObtenidos}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>        <Card className="border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Horas de Estudio</p>
                <p className="text-3xl font-bold text-blue-600">{dashboardStats.horasTotales}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Eventos recientes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Continuar con tus Eventos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventosRecientes.map((evento) => (
                <div key={evento.id_evento} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  {/* Imagen del evento mejorada */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-primary/20 bg-white shadow-sm flex items-center justify-center">
                    {evento.url_foto ? (
                      <img src={evento.url_foto} alt={evento.nombre} className="object-cover w-full h-full" loading="lazy" />
                    ) : (
                      <Calendar className="h-10 w-10 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{evento.nombre}</h4>
                    <p className="text-sm text-muted-foreground">Organizador: {evento.organizador || 'N/A'}</p>
                    <p className="text-sm text-primary font-medium">Modalidad: {evento.modalidad}</p>
                    {/* Barra de asistencia */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Asistencia</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${evento.asistencias || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{evento.asistencias || 0}%</span>
                    </div>
                    {/* Nota final */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">Nota:</span>
                      <span className="font-semibold text-blue-700 text-sm">{evento.nota_final !== undefined ? evento.nota_final : '-'}</span>
                    </div>
                    {/* Estado y horas */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (evento.estadoInscripcion || evento.estado_inscripcion) === 'activo' ? 'bg-green-100 text-green-700' :
                        (evento.estadoInscripcion || evento.estado_inscripcion) === 'completado' ? 'bg-blue-100 text-blue-700' :
                        (evento.estadoInscripcion || evento.estado_inscripcion) === 'Aprobado' ? 'bg-blue-100 text-blue-700' :
                        (evento.estadoInscripcion || evento.estado_inscripcion) === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {((evento.estadoInscripcion || evento.estado_inscripcion) || 'Sin estado')?.toString().toUpperCase()}
                      </span>
                      <span>{evento.num_horas || evento.numeroHoras || 0} horas</span>
                    </div>
                  </div>
                  
                </div>
              ))}
            </CardContent>
          </Card>
        </div>        {/* Eventos próximos */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {proximosEventos.map((evento) => (
                <div key={evento.id_evento} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {evento.tipo_evento}
                    </span>
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">{evento.nombre}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{safeFormatDate(evento.fecha_inicio || evento.fechaInicio)}</span>
                    <Clock className="h-3 w-3 ml-2" />
                    <span>{evento.hora}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                Ver todos los eventos
              </Button>
            </CardContent>
          </Card>

          {/* Progreso semanal */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Tu Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Meta semanal</span>
                    <span className="font-medium">6/10 horas</span>
                  </div>
                  <div className="bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-3/5 transition-all duration-300" />
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    ¡Excelente progreso! Estás a solo 4 horas de alcanzar tu meta semanal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
