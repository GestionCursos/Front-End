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
