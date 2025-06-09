"use client"
import '@/app/globals.css'
import React, { useEffect, useState } from 'react';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from 'lucide-react';
import { getDataDashboard } from '@/app/Services/dashboardService';

export default function Inicio() {
    const [data, setData] = useState<{ TotalEventos: number; UsuariosRegistrados: number; eventosRecientes: [{ nombre: string, visible: string }] } | null>(null);
    const [cursosPopulares, setCursosPopularesData] = useState<Array<{ nombre: string; estudiantes: string; organizador: string; id_evento: number }> | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const result = await getDataDashboard();
                setData(result);
                setCursosPopularesData(result.eventosPopulares)

            } catch (error) {
                console.error("Error al obtener autoridades", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-red-700 mb-2">Panel de Administración</h1>
            <p className="text-gray-600 mb-6">Gestiona eventos, cursos y usuarios desde aquí</p>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm font-medium text-gray-600">Total Eventos</p>
                        <p className="text-2xl font-bold">{data?.TotalEventos ?? 'Cargando...'}</p>
                        <p className="text-xs text-green-600">+2 desde el mes pasado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm font-medium text-gray-600">Total Cursos</p>
                        <p className="text-2xl font-bold">8</p>
                        <p className="text-xs text-green-600">+1 desde el mes pasado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm font-medium text-gray-600">Usuarios Registrados</p>
                        <p className="text-2xl font-bold">{data?.UsuariosRegistrados ?? 'Cargando...'}</p>
                        <p className="text-xs text-green-600">+180 desde el mes pasado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
                        <p className="text-2xl font-bold">€15,420</p>
                        <p className="text-xs text-green-600">+12% desde el mes pasado</p>
                    </CardContent>
                </Card>
            </div>


            {/* Acciones rápidas y eventos recientes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <h2 className="text-lg font-bold mb-2">Acciones Rápidas</h2>
                        <div className="flex flex-wrap gap-4">
                            <Button className="bg-red-600 hover:bg-red-700"
                            >+ Nuevo Evento</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <h2 className="text-lg font-bold mb-2">Eventos Recientes</h2>
                        <ul className="space-y-2">
                            {loading ? (
                                <li>Cargando eventos recientes...</li>
                            ) : (
                                data?.eventosRecientes?.map((evento, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <span>{evento.nombre}</span>
                                        <Badge
                                            className={
                                                evento.visible === "ACTIVADO"
                                                    ? "bg-green-200 text-green-700"
                                                    : "bg-yellow-200 text-yellow-800"
                                            }
                                        >
                                            {evento.visible}
                                        </Badge>
                                    </li>
                                ))
                            )}
                        </ul>
                    </CardContent>
                </Card>

            </div>

            {/* Cursos Populares */}
            <Card>
                <CardContent className="p-4">
                    <h2 className="text-lg font-bold mb-4">Cursos Más Populares</h2>
                    <ul className="space-y-4">
                        {loading ? (
                            <li>Cargando eventos populares...</li>
                        ) : (
                            cursosPopulares?.map((evento, index) => (
                                <li key={evento.id_evento} className="flex justify-between">
                                    <div>
                                        <p className="font-semibold">{evento.nombre}</p>
                                        <p className="text-sm text-gray-500">Instructor: {evento.organizador}</p>
                                    </div>
                                    <span className="text-red-700 font-semibold">{evento.estudiantes} estudiantes</span>
                                </li>

                            ))
                        )}

                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
