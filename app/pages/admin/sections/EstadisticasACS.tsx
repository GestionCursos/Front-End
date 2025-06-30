"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Pie, PieChart, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer } from "recharts"
import {
    Activity,
    CheckCircle2,
    Clock,
    Code2,
    GitBranch,
    TrendingUp,
    Users,
    Zap,
    RefreshCw,
    AlertCircle, Info
} from "lucide-react"
import { useDashboardData } from "@/app/hooks/use-dashboard-data"
import { filterDataByPeriod } from "@/app/utils/date-utils"
import { ChartCardSkeleton, CollaboratorSkeleton, MetricCardSkeleton } from "@/components/loading-skeleton"


// Constantes para evitar re-renders innecesarios
const PERIOD_OPTIONS = ["7d", "30d", "90d"] as const

const CHART_CONFIG = {
    solicitudes: { label: "Solicitudes", color: "#6366f1" },
    aprobadas: { label: "Aprobadas", color: "#10b981" },
    rechazadas: { label: "Rechazadas", color: "#ef4444" },
    pendientes: { label: "Pendientes", color: "#f59e0b" },
} as const

export default function DashboardACS() {
    const [selectedPeriod, setSelectedPeriod] = useState<string>("30d")
    const { data, isLoading, error, refetch } = useDashboardData()

    // Memoizar datos filtrados para evitar recálculos innecesarios
    const filteredEvolutionData = useMemo(() => {
        return filterDataByPeriod(data.datosEvolucion, selectedPeriod)
    }, [data.datosEvolucion, selectedPeriod])

    // Memoizar métricas calculadas
    const metricas = useMemo(() => {
        const colaboradoresActivos = Math.max(data.colaboradores.length - 1, 0) || 12

        // Procesar estados de cambios
        const estadosData = data.estados.reduce(
            (acc, estado) => {
                // Normalizar nombres de estados para evitar problemas de case sensitivity
                const estadoNormalizado = estado.estado.toLowerCase().replace(/\s+/g, "")
                acc[estadoNormalizado] = estado.valor
                return acc
            },
            {} as Record<string, number>,
        )

        // Calcular totales
        const completados = estadosData.completado || estadosData.aprobado || 0
        const enProceso = estadosData.enproceso || estadosData.implementando || estadosData.revision || 0
        const pendientes = estadosData.pendiente || 0
        const rechazados = estadosData.rechazado || 0

        // Total de cambios (suma de todos los estados o fallback)
        const totalCambios = completados + enProceso + pendientes + rechazados || data.cambios.length || 247

        // Calcular tasa de aprobación: (Completados + En Proceso) / Total * 100
        // Esto excluye los pendientes y rechazados
        const cambiosAprobados = completados + enProceso
        const tasaAprobacion = totalCambios > 0 ? Math.round((cambiosAprobados / totalCambios) * 100 * 10) / 10 : 0

        return {
            totalCambios,
            cambiosPendientes: pendientes,
            cambiosAprobados: completados,
            cambiosRechazados: rechazados,
            cambiosEnProceso: enProceso,
            tiempoPromedio: "24 h",
            tasaAprobacion,
            desarrolladoresActivos: colaboradoresActivos,
            proyectosAfectados: 8,
        }
    }, [data.cambios.length, data.colaboradores.length, data.estados])


    // Funciones memoizadas para evitar re-renders
    const getEstadoBadge = useCallback((estado: string) => {
        const variants = {
            Aprobado: "default",
            "En Revisión": "secondary",
            Pendiente: "outline",
            Rechazado: "destructive",
        } as const
        return <Badge variant={variants[estado as keyof typeof variants] || "outline"}>{estado}</Badge>
    }, [])

    const getPrioridadColor = useCallback((prioridad: string) => {
        const colors = {
            Alta: "text-red-600",
            Media: "text-yellow-600",
            Baja: "text-green-600",
        }
        return colors[prioridad as keyof typeof colors] || "text-gray-600"
    }, [])

    const handlePeriodChange = useCallback((period: string) => {
        setSelectedPeriod(period)
    }, [])

    const handleRetry = useCallback(() => {
        refetch()
    }, [refetch])

    // Componente de error reutilizable
    const ErrorDisplay = ({ message }: { message: string }) => (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-sm text-red-600 mb-4">Error: {message}</p>
            <Button variant="outline" size="sm" onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
            </Button>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="p-6 space-y-6">
                {/* Métricas Principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
                    ) : (
                        <>
                            <Card className="relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total de Cambios</CardTitle>
                                    <Activity className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metricas.totalCambios.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="text-green-600">+12%</span> vs mes anterior
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10" />
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Tasa de Aprobación</CardTitle>
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metricas.tasaAprobacion}%</div>
                                    <Progress value={metricas.tasaAprobacion} className="mt-2" />
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10" />
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                                    <Clock className="h-4 w-4 text-orange-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metricas.tiempoPromedio}</div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="text-green-600">-0.3h</span> vs mes anterior
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Desarrolladores Activos</CardTitle>
                                    <Users className="h-4 w-4 text-purple-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metricas.desarrolladoresActivos}</div>
                                    <p className="text-xs text-muted-foreground">En {metricas.proyectosAfectados} proyectos</p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Contenido Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Evolución Temporal */}
                    {isLoading ? (
                        <ChartCardSkeleton className="lg:col-span-2" />
                    ) : (
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            Evolución de Cambios
                                        </CardTitle>
                                        <CardDescription>
                                            Tendencia de solicitudes en los últimos {Number.parseInt(selectedPeriod)} días
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-end max-w-full">
                                        {PERIOD_OPTIONS.map((period) => (
                                            <Button
                                                key={period}
                                                variant={selectedPeriod === period ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handlePeriodChange(period)}
                                            >
                                                {period}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {filteredEvolutionData.length > 0 ? (
                                    <ChartContainer config={CHART_CONFIG} className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={filteredEvolutionData}>
                                                <defs>
                                                    <linearGradient id="colorSolicitudes" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorAprobadas" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                <XAxis dataKey="fecha" stroke="#64748b" fontSize={12} />
                                                <YAxis stroke="#64748b" fontSize={12} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="solicitudes"
                                                    stroke="#6366f1"
                                                    fillOpacity={1}
                                                    fill="url(#colorSolicitudes)"
                                                    strokeWidth={2}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="aprobadas"
                                                    stroke="#10b981"
                                                    fillOpacity={1}
                                                    fill="url(#colorAprobadas)"
                                                    strokeWidth={2}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                        No hay datos para el período seleccionado
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Distribución por Estado */}
                    {isLoading ? (
                        <ChartCardSkeleton />
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5" />
                                    Estado de Cambios
                                </CardTitle>
                                <CardDescription>Distribución actual por estado</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.estados.length > 0 ? (
                                    <>
                                        <div className="space-y-4">
                                            {data.estados.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                        <span className="text-sm font-medium">{item.estado}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-muted-foreground">{item.porcentaje}%</span>
                                                        <span className="text-sm font-bold">{item.valor}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6">
                                            <ChartContainer config={CHART_CONFIG} className="h-[200px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={data.estados}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            paddingAngle={5}
                                                            dataKey="valor"
                                                        >
                                                            {data.estados.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <ChartTooltip content={<ChartTooltipContent />} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </ChartContainer>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                                        No hay datos de estados disponibles
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sección Inferior */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tipos de Cambio */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code2 className="h-5 w-5" />
                                Tipos de Cambio
                            </CardTitle>
                            <CardDescription>Distribución por categoría técnica</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.tiposCambio.map((tipo, index) => {
                                    const Icon = Info;
                                    return (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 rounded-lg" style={{ backgroundColor: `${tipo.color}20` }}>
                                                    <Icon className="h-4 w-4" style={{ color: tipo.color }} />
                                                </div>
                                                <span className="font-medium">{tipo.tipo}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="text-right">
                                                    <div className="text-lg font-bold">{tipo.cantidad}</div>
                                                    <div className="text-xs text-muted-foreground">cambios</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Desarrolladores */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Top Desarrolladores
                            </CardTitle>
                            <CardDescription>Rendimiento del equipo este mes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => <CollaboratorSkeleton key={i} />)
                                ) : error ? (
                                    <ErrorDisplay message={error} />
                                ) : data.colaboradores.length > 0 ? (
                                    data.colaboradores.map((dev, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg bg-slate-50"
                                        >
                                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={dev.avatar || "/placeholder.svg"} alt={dev.nombre} />
                                                    <AvatarFallback>
                                                        {dev.nombre
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{dev.nombre}</div>
                                                    <div className="text-sm text-muted-foreground">{dev.especialidad}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg font-bold">{dev.cambios || 0}</span>
                                                    <span className="text-xs text-green-600">ramas</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">No hay colaboradores disponibles</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cambios Recientes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Actividad Reciente
                        </CardTitle>
                        <CardDescription>Últimos cambios registrados en el sistema</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-white">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 rounded-lg bg-slate-200 animate-pulse" />
                                            <div className="space-y-2">
                                                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                                                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="h-6 w-20 bg-slate-200 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : data.cambios.length > 0 ? (
                            <div className="space-y-4">
                                {data.cambios.map((cambio, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 rounded-lg border bg-white"
                                    >
                                        {/* Izquierda: Info principal */}
                                        <div className="flex flex-1 items-start space-x-4 min-w-0">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                    <GitBranch className="h-5 w-5 text-blue-600" />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-0.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span
                                                        className="text-sm font-medium text-blue-600 truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]"
                                                        title={cambio.id}
                                                    >
                                                        {cambio.id}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {cambio.tipo}
                                                    </Badge>
                                                </div>
                                                <p
                                                    className="text-sm font-medium text-gray-900 truncate"
                                                    title={cambio.titulo}
                                                >
                                                    {cambio.titulo}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">por {cambio.desarrollador}</p>
                                            </div>
                                        </div>

                                        {/* Derecha: Estado, prioridad y acción */}
                                        <div className="flex items-start justify-between sm:flex-col sm:items-end space-x-4 sm:space-x-0 sm:space-y-1">
                                            <div className="text-right">
                                                <div className="flex items-center space-x-2">
                                                    {getEstadoBadge(cambio.estado)}
                                                    <span className={`text-xs font-medium ${getPrioridadColor(cambio.prioridad)}`}>
                                                        {cambio.prioridad}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{cambio.fecha}</p>
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">No hay cambios recientes</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
