"use client"

import { useState, useEffect } from "react"
import { Search, GitBranch, User, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface AuditRecord {
    ID: number
    Módulo: string
    "Tipo de Cambio": string
    "Otro Tipo": string
    Descripción: string
    Justificación: string
    Urgencia: string
    Estado: string
    "Colab. Backend": string | null
    "Colab. Frontend": string | null
    "Rama Backend": string | null
    "Rama Frontend": string | null
    "Fecha de Creación": string
    "Solicitado por": string
    "Aprobado por": string
    backendCommits: number
    frontendCommits: number
}

// Real fetch from backend
const fetchAuditData = async (): Promise<AuditRecord[]> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/estadisticas-itil/branch-stats`);
        if (!response.ok) {
            throw new Error('Failed to fetch audit data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching audit data:', error);
        return [];
    }
}

const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case "completado":
            return (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completado
                </Badge>
            )
        case "en progreso":
            return (
                <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    En Progreso
                </Badge>
            )
        case "pendiente":
            return (
                <Badge variant="default" className="bg-red-100 text-red-800 border-red-200">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Pendiente
                </Badge>
            )
        default:
            return <Badge variant="secondary">{status}</Badge>
    }
}

const getUrgencyBadge = (urgency: string) => {
    switch (urgency.toLowerCase()) {
        case "alta":
            return <Badge variant="destructive">Alta</Badge>
        case "media":
            return (
                <Badge variant="default" className="bg-orange-100 text-orange-800 border-orange-200">
                    Media
                </Badge>
            )
        case "baja":
            return <Badge variant="secondary">Baja</Badge>
        default:
            return <Badge variant="outline">{urgency}</Badge>
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default function AuditDashboard() {
    const [data, setData] = useState<AuditRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [moduleFilter, setModuleFilter] = useState("all")

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError(null)
                const auditData = await fetchAuditData()
                setData(auditData)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido")
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    const filteredData = data.filter((record) => {
        const matchesSearch =
            record.Descripción.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record["Solicitado por"].toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.ID.toString().includes(searchTerm)

        const matchesStatus = statusFilter === "all" || record.Estado.toLowerCase() === statusFilter.toLowerCase()
        const matchesModule = moduleFilter === "all" || record.Módulo.toLowerCase() === moduleFilter.toLowerCase()

        return matchesSearch && matchesStatus && matchesModule
    })

    const totalCommits = data.reduce((sum, record) => sum + record.backendCommits + record.frontendCommits, 0)
    const completedRecords = data.filter((record) => record.Estado.toLowerCase() === "completado").length

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-600">Error al cargar datos</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => window.location.reload()}>Reintentar</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard de Auditoría</h1>
                    <p className="text-muted-foreground">Seguimiento y control de cambios del sistema</p>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-12" /> : data.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {loading ? <Skeleton className="h-8 w-12" /> : completedRecords}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-12" /> : totalCommits}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Tasa Completado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loading ? (
                                    <Skeleton className="h-8 w-16" />
                                ) : (
                                    `${data.length > 0 ? Math.round((completedRecords / data.length) * 100) : 0}%`
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por descripción, solicitante o ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filtrar por estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    <SelectItem value="completado">Completado</SelectItem>
                                    <SelectItem value="en progreso">En Progreso</SelectItem>
                                    <SelectItem value="pendiente">Pendiente</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={moduleFilter} onValueChange={setModuleFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filtrar por módulo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los módulos</SelectItem>
                                    <SelectItem value="home">Home</SelectItem>
                                    <SelectItem value="auth">Auth</SelectItem>
                                    <SelectItem value="events">Events</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de datos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Registros de Auditoría</CardTitle>
                        <CardDescription>
                            {loading ? "Cargando datos..." : `Mostrando ${filteredData.length} de ${data.length} registros`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Módulo</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Descripción</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Urgencia</TableHead>
                                            <TableHead>Colaboradores</TableHead>
                                            <TableHead>Commits</TableHead>
                                            <TableHead>Fecha</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredData.map((record) => (
                                            <TableRow key={record.ID}>
                                                <TableCell className="font-medium">#{record.ID}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{record.Módulo}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-medium">{record["Tipo de Cambio"]}</div>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {record["Otro Tipo"]}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-xs">
                                                    <div className="truncate" title={record.Descripción}>
                                                        {record.Descripción}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(record.Estado)}</TableCell>
                                                <TableCell>{getUrgencyBadge(record.Urgencia)}</TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {record["Colab. Frontend"] && (
                                                            <div className="flex items-center gap-1 text-sm">
                                                                <User className="w-3 h-3" />
                                                                <span className="text-blue-600">FE: {record["Colab. Frontend"]}</span>
                                                            </div>
                                                        )}
                                                        {record["Colab. Backend"] && (
                                                            <div className="flex items-center gap-1 text-sm">
                                                                <User className="w-3 h-3" />
                                                                <span className="text-green-600">BE: {record["Colab. Backend"]}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <GitBranch className="w-3 h-3 text-blue-500" />
                                                            <span>FE: {record.frontendCommits}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <GitBranch className="w-3 h-3 text-green-500" />
                                                            <span>BE: {record.backendCommits}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{formatDate(record["Fecha de Creación"])}</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
