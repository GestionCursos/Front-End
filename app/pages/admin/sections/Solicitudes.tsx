"use client"
import '@/app/globals.css'
import React from 'react';
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, CheckCircle, XCircle } from 'lucide-react';
import { getSolicitudesError, getSolicitudesGenerales } from '@/app/Services/dashboardService';
import { SolicitudGeneral } from '@/app/models/SolicitudGeneral';
import { SolicitudConError } from '@/app/models/SolicitudConError';
import Solicitud from '@/app/Services/solicitudService';
export default function Solicitudes() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSolicitudId, setSelectedSolicitudId] = useState<number | null>(null);
    const [nuevoEstado, setNuevoEstado] = useState<"Aprobado" | "Rechazado" | null>(null);
    const [descripcion, setDescripcion] = useState("");
    const abrirModal = (idSolicitud: number, estado: "Aprobado" | "Rechazado") => {
        setSelectedSolicitudId(idSolicitud);
        setNuevoEstado(estado);
        setModalVisible(true);
    };



    const [solicitudesGenerales, setSolicitudesGenerales] = useState<SolicitudGeneral[]>([]);
    const [solicitudesError, setSolicitudesError] = useState<SolicitudConError[]>([]);

    useEffect(() => {
        const datos = async () => {
            const solicitudesGenerales = await getSolicitudesGenerales()
            const solicitudesEerror = await getSolicitudesError()
            setSolicitudesGenerales(solicitudesGenerales);
            setSolicitudesError(solicitudesEerror);
            console.log(solicitudesEerror)
        }
        datos();
    }, []);

    const confirmarCambioEstado = async () => {
        if (!selectedSolicitudId || !nuevoEstado || !descripcion.trim()) {
            alert("Por favor escribe una descripción.");
            return;
        }

        const result = await Solicitud.actualizarEstado(nuevoEstado, selectedSolicitudId, descripcion);
        if (result) {
            setSolicitudesGenerales(prev => prev.filter(sol => sol.idSolicitud !== selectedSolicitudId));
            setSolicitudesError(prev => prev.filter(detalle => detalle.idSolicitud.idSolicitud !== selectedSolicitudId));
        }

        // Limpia estados
        setModalVisible(false);
        setSelectedSolicitudId(null);
        setNuevoEstado(null);
        setDescripcion("");
    };
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h2 className="text-2xl font-bold text-red-700">Solicitudes Generales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {solicitudesGenerales.map((sol) => (
                    <Card key={sol.idSolicitud} className="border rounded-xl shadow-sm hover:shadow-md transition">
                        <CardContent className="p-5 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold">{sol.idUser.nombres} {sol.idUser.apellidos}</h3>
                                    <p className="text-sm text-gray-500">{sol.idUser.correo}</p>
                                </div>
                                <Badge fontVariant="outline" className="capitalize">{sol.estado}</Badge>
                            </div>

                            <div className="border-t pt-3 space-y-2 text-sm text-gray-700">
                                <p><span className="font-medium">Apartado:</span> {sol.apartado}</p>
                                <p><span className="font-medium">Tipo:</span> {sol.tipoCambio}</p>
                                <p><span className="font-medium">Urgencia:</span> {sol.urgencia}</p>
                                <p><span className="font-medium">Justificación:</span> {sol.justificacion}</p>
                                <a
                                    href={sol.archivo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline font-medium"
                                >
                                    Ver archivo adjunto
                                </a>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t mt-3">
                                <button
                                    onClick={() => abrirModal(sol.idSolicitud, "Aprobado")}
                                    className="inline-flex items-center gap-1 px-4 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
                                >
                                    <CheckCircle size={16} /> Aprobar
                                </button>
                                <button
                                    onClick={() => abrirModal(sol.idSolicitud, "Rechazado")}
                                    className="inline-flex items-center gap-1 px-4 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
                                >
                                    <XCircle size={16} /> Rechazar
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <h2 className="text-2xl font-bold text-red-700 mt-10">Solicitudes de Error</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {solicitudesError.map((detalle) => (
                    <Card key={detalle.idDetalle} className="border rounded-xl shadow-sm hover:shadow-md transition">
                        <CardContent className="p-5 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold">{detalle.idSolicitud.idUser.nombres} {detalle.idSolicitud.idUser.apellidos}</h3>
                                    <p className="text-sm text-gray-500">{detalle.idSolicitud.tipoCambio}</p>
                                </div>
                                <Badge fontVariant="outline" className="capitalize">{detalle.idSolicitud.estado}</Badge>
                            </div>

                            <div className="border-t pt-3 space-y-2 text-sm text-gray-700">
                                <p><span className="font-medium">Apartado:</span> {detalle.idSolicitud.apartado}</p>
                                <p><span className="font-medium">Urgencia:</span> {detalle.idSolicitud.urgencia}</p>
                                <p><span className="font-medium">Fecha incidente:</span> {new Date(detalle.fechaIncidente).toLocaleString()}</p>
                                <p><span className="font-medium">Pasos para reproducir:</span> {detalle.pasosReproduccion}</p>
                                <p><span className="font-medium">Resultado esperado:</span> {detalle.resultadoEsperado}</p>
                                <p><span className="font-medium">Resultado observado:</span> {detalle.resultadoObservado}</p>
                                <p><span className="font-medium">Frecuencia:</span> {detalle.frecuenciaError}</p>
                                <p><span className="font-medium">Mensaje de error:</span> {detalle.mensajeError}</p>
                                <p><span className="font-medium">Sistema/Navegador:</span> {detalle.sistemaNavegador}</p>
                                <p><span className="font-medium">URL:</span> <a href={detalle.urlError} className="text-blue-600 underline">{detalle.urlError}</a></p>
                                <p><span className="font-medium">Workaround:</span> {detalle.workaround}</p>

                                <a
                                    href={
                                        detalle.idSolicitud.archivo.includes("http")
                                            ? detalle.idSolicitud.archivo
                                            : ""
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline font-medium"
                                >
                                    Ver archivo adjunto
                                </a>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t mt-3">
                                <button
                                    onClick={() => abrirModal(detalle.idSolicitud.idSolicitud, "Aprobado")}
                                    className="inline-flex items-center gap-1 px-4 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
                                >
                                    <CheckCircle size={16} /> Aprobar
                                </button>
                                <button
                                    onClick={() => abrirModal(detalle.idSolicitud.idSolicitud, "Rechazado")}
                                    className="inline-flex items-center gap-1 px-4 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
                                >
                                    <XCircle size={16} /> Rechazar
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {modalVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                        <div className="bg-white rounded-md p-6 w-full max-w-md space-y-4 shadow-lg">
                            <h3 className="text-lg font-bold">Confirmar cambio de estado</h3>
                            <p className="text-sm text-gray-600">Por favor proporciona una descripción para continuar.</p>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="w-full border rounded-md p-2 text-sm"
                                rows={4}
                                placeholder="Escribe la descripción..."
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setModalVisible(false)}
                                    className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarCambioEstado}
                                    className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}