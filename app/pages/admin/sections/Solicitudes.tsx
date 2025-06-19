"use client"
import '@/app/globals.css'
import React from 'react';
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useSolicitudesGenerales } from "./useSolicitudesGenerales";
import Solicitud from '@/app/Services/solicitudService';
import SolicitudCard from './SolicitudCard';
import SolicitudCardPendiente from './SolicitudCardPendiente';
import SolicitudCardAprobada from './SolicitudCardAprobada';
import SolicitudCardImplementando from './SolicitudCardImplementando';
import SolicitudCardFinalizada, { FiltroEstadoFinalizadas } from './SolicitudCardFinalizada';
import { Tabs, Tab } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { SolicitudGeneral } from '@/app/models/SolicitudGeneral';

export default function Solicitudes() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSolicitudId, setSelectedSolicitudId] = useState<number | null>(null);
    const [nuevoEstado, setNuevoEstado] = useState<"Aprobado" | "Rechazado" | null>(null);
    const [descripcion, setDescripcion] = useState("");
    const [tab, setTab] = useState(0);
    const [search, setSearch] = useState("");
    // Un filtro de búsqueda por cada tab/sección
    const [searchPendiente, setSearchPendiente] = useState("");
    const [searchAprobada, setSearchAprobada] = useState("");
    const [searchImplementando, setSearchImplementando] = useState("");
    const [searchFinalizada, setSearchFinalizada] = useState("");
    const [searchEstadoFinalizada, setSearchEstadoFinalizada] = useState("");
    const [errorModal, setErrorModal] = useState<string | null>(null);
    const [successModal, setSuccessModal] = useState<string | null>(null);
    const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);
    const abrirModal = (idSolicitud: number, estado: "Aprobado" | "Rechazado") => {
        setSelectedSolicitudId(idSolicitud);
        setNuevoEstado(estado);
        setModalVisible(true);
    };

    const { solicitudes, loading, refetch, setSolicitudes } = useSolicitudesGenerales();

    useEffect(() => {
        refetch();
        // Escuchar evento global para recargar solicitudes en tiempo real
        const handler = () => refetch();
        window.addEventListener('solicitudes:refresh', handler);
        return () => window.removeEventListener('solicitudes:refresh', handler);
    }, [refetch]);

    const confirmarCambioEstado = async () => {
        if (!selectedSolicitudId || !nuevoEstado || !descripcion.trim()) {
            setErrorModal("Por favor escribe una descripción.");
            return;
        }

        const payload = {
            idSolicitud: selectedSolicitudId,
            estado: nuevoEstado,
            justificacion: descripcion.trim(),
        };

        try {
            const result = await Solicitud.actualizarEstado(payload);

            if (result) {
                // Actualiza el estado local de la solicitud cambiando su estado
                setSolicitudes(prev => prev.map(sol =>
                    sol.idSolicitud === selectedSolicitudId
                        ? { ...sol, estado: nuevoEstado, justificacion: descripcion.trim() }
                        : sol
                ));
                setSuccessModal('Solicitud aprobada correctamente. Se notificó por correo');
            } else {
                setErrorModal("Error al actualizar el estado.");
            }
        } catch (error) {
            setErrorModal("Ocurrió un error inesperado al actualizar el estado.");
            console.error(error);
        }
        setModalVisible(false);
        setSelectedSolicitudId(null);
        setNuevoEstado(null);
        setDescripcion("");
    };

    // Función de filtrado tipada
    const filtrarSolicitudes = (lista: SolicitudGeneral[], search: string) => {
        if (!search.trim()) return lista;
        return lista.filter((sol: SolicitudGeneral) =>
            (sol.idUser?.nombres + " " + sol.idUser?.apellidos).toLowerCase().includes(search.toLowerCase()) ||
            sol.idUser?.correo?.toLowerCase().includes(search.toLowerCase()) ||
            sol.apartado?.toLowerCase().includes(search.toLowerCase()) ||
            sol.tipoCambio?.toLowerCase().includes(search.toLowerCase()) ||
            sol.justificacion?.toLowerCase().includes(search.toLowerCase()) ||
            (sol.colaboradorGithubBackend || "").toLowerCase().includes(search.toLowerCase()) ||
            (sol.colaboradorGithubFrontend || "").toLowerCase().includes(search.toLowerCase())
        );
    };

    // Nuevo: callback global para éxito
    const handleSuccess = (msg: string, afterClose?: () => void) => {
        setSuccessModal(msg);
        setPendingAction(() => afterClose || null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-2 md:p-6">
            <h2 className="text-3xl font-extrabold text-red-800 mb-6 text-center tracking-tight drop-shadow-sm">Gestión de Solicitudes</h2>
            <div className="w-full flex justify-center mb-8">
                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" className="bg-white rounded-xl shadow-md">
                    <Tab label={<span className="flex items-center gap-2"><Loader2 className="w-4 h-4 text-yellow-500" />Pendientes</span>} />
                    <Tab label={<span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" />Aprobadas</span>} />
                    <Tab label={<span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-blue-600" />Implementando</span>} />
                    <Tab label={<span className="flex items-center gap-2"><XCircle className="w-4 h-4 text-gray-500" />Finalizadas</span>} />
                </Tabs>
            </div>
            <div className="w-full max-w-6xl mx-auto">
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <CircularProgress color="error" />
                    </div>
                )}
                {!loading && (
                    <>
                        {tab === 0 && (
                            <div>
                                <h3 className="text-lg font-bold mt-6 mb-2">Pendientes</h3>
                                {/* Input de búsqueda más largo (casi de lado a lado en desktop) */}
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, correo, apartado, tipo, justificación, colaborador..."
                                    className="mb-8 w-full max-w-4xl px-6 py-3 border-2 border-red-200 rounded-2xl shadow focus:outline-none focus:ring-4 focus:ring-red-100 text-base placeholder-gray-400 transition-all duration-200 mx-auto block"
                                    value={searchPendiente}
                                    onChange={e => setSearchPendiente(e.target.value)}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {filtrarSolicitudes(solicitudes.filter(sol => sol.estado === 'Pendiente'), searchPendiente).length === 0 ? (
                                        <div>No hay solicitudes pendientes.</div>
                                    ) : (
                                        filtrarSolicitudes(solicitudes.filter(sol => sol.estado === 'Pendiente'), searchPendiente).map((sol: any) => (
                                            <SolicitudCardPendiente
                                                key={sol.idSolicitud}
                                                solicitud={sol}
                                                onAprobar={() => abrirModal(sol.idSolicitud, 'Aprobado')}
                                                onRechazar={() => abrirModal(sol.idSolicitud, 'Rechazado')}
                                                onSuccess={(msg: string) => handleSuccess(msg, refetch)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        {tab === 1 && (
                            <div>
                                <h3 className="text-lg font-bold mt-6 mb-2">Aprobadas (asignar responsables)</h3>
                                {/* Input de búsqueda más largo (casi de lado a lado en desktop) */}
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, correo, apartado, tipo, justificación, colaborador..."
                                    className="mb-8 w-full max-w-4xl px-6 py-3 border-2 border-green-200 rounded-2xl shadow focus:outline-none focus:ring-4 focus:ring-green-100 text-base placeholder-gray-400 transition-all duration-200 mx-auto block"
                                    value={searchAprobada}
                                    onChange={e => setSearchAprobada(e.target.value)}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {filtrarSolicitudes(solicitudes.filter(sol => sol.estado === 'Aprobado'), searchAprobada).length === 0 ? (
                                        <div>No hay solicitudes aprobadas.</div>
                                    ) : (
                                        filtrarSolicitudes(solicitudes.filter(sol => sol.estado === 'Aprobado'), searchAprobada).map((solicitud: any) => (
                                            <SolicitudCardAprobada
                                                key={solicitud.idSolicitud}
                                                solicitud={solicitud}
                                                onChange={(id: number, nuevoEstado: string) => {
                                                    if (id && nuevoEstado) {
                                                        setSolicitudes((prev: any[]) => prev.map(sol =>
                                                            sol.idSolicitud === id ? { ...sol, estado: nuevoEstado } : sol
                                                        ));
                                                    } else {
                                                        refetch();
                                                    }
                                                }}
                                                onSuccess={(msg: string) => handleSuccess(msg, refetch)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        {tab === 2 && (
                            <div>
                                <h3 className="text-lg font-bold mt-6 mb-2">En implementación</h3>
                                {/* Input de búsqueda más largo (casi de lado a lado en desktop) */}
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, correo, apartado, tipo, justificación, colaborador..."
                                    className="mb-8 w-full max-w-4xl px-6 py-3 border-2 border-blue-200 rounded-2xl shadow focus:outline-none focus:ring-4 focus:ring-blue-100 text-base placeholder-gray-400 transition-all duration-200 mx-auto block"
                                    value={searchImplementando}
                                    onChange={e => setSearchImplementando(e.target.value)}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {filtrarSolicitudes(solicitudes.filter(sol => sol.estado === 'Implementando'), searchImplementando).length === 0 ? (
                                        <div>No hay solicitudes en implementación.</div>
                                    ) : (
                                        filtrarSolicitudes(solicitudes.filter(sol => sol.estado === 'Implementando'), searchImplementando).map((solicitud: any) => (
                                            <SolicitudCardImplementando
                                                key={solicitud.idSolicitud}
                                                solicitud={solicitud}
                                                onChange={refetch}
                                                onSuccess={(msg: string) => handleSuccess(msg, refetch)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        {tab === 3 && (
                            <div>
                                <h3 className="text-lg font-bold mt-6 mb-2">Completadas o Canceladas</h3>
                                <FiltroEstadoFinalizadas value={searchEstadoFinalizada} onChange={setSearchEstadoFinalizada} />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, correo, apartado, tipo, justificación, colaborador..."
                                    className="mb-8 w-full max-w-4xl px-6 py-3 border-2 border-gray-300 rounded-2xl shadow focus:outline-none focus:ring-4 focus:ring-gray-100 text-base placeholder-gray-400 transition-all duration-200 mx-auto block"
                                    value={searchFinalizada}
                                    onChange={e => setSearchFinalizada(e.target.value)}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {filtrarSolicitudes(
                                        solicitudes.filter((sol: any) =>
                                            (sol.estado === 'Completado' || sol.estado === 'Cancelado' || sol.estado === 'Rechazado') &&
                                            (!searchEstadoFinalizada || sol.estado === searchEstadoFinalizada)
                                        ),
                                        searchFinalizada
                                    ).length === 0 ? (
                                        <div>No hay solicitudes completadas, canceladas o rechazadas.</div>
                                    ) : (
                                        filtrarSolicitudes(
                                            solicitudes.filter((sol: any) =>
                                                (sol.estado === 'Completado' || sol.estado === 'Cancelado' || sol.estado === 'Rechazado') &&
                                                (!searchEstadoFinalizada || sol.estado === searchEstadoFinalizada)
                                            ),
                                            searchFinalizada
                                        ).map((solicitud: any) => (
                                            <SolicitudCardFinalizada key={solicitud.idSolicitud} solicitud={solicitud} onFilterChange={() => {}} />
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            {/* Modal de cambio de estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
            {/* Modal de error */}
            {errorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-md p-6 w-full max-w-md space-y-4 shadow-lg">
                        <h3 className="text-lg font-bold text-red-700">Error</h3>
                        <p className="text-sm text-gray-700">{errorModal}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setErrorModal(null)}
                                className="px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal de éxito global */}
            {successModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000]">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center border-2 border-green-500">
                        <h3 className="text-2xl font-bold mb-4 text-green-700">
                            Éxito
                        </h3>
                        <p className="mb-6 text-lg text-gray-700">{successModal}</p>
                        <button
                            onClick={() => {
                                setSuccessModal(null);
                                if (pendingAction) {
                                    pendingAction();
                                    setPendingAction(null);
                                }
                            }}
                            className="px-6 py-2 bg-green-600 text-white rounded-full text-lg font-semibold hover:bg-green-700 transition"
                        >Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
