// Imports y configuración
"use client"
import '@/app/globals.css'
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from 'lucide-react';
import { getDataDashboard } from '@/app/Services/dashboardService';


export default function Inicio() {
    // Estados y lógica de negocio
    const [data, setData] = useState<{ TotalEventos: number; UsuariosRegistrados: number; eventosRecientes: [{ nombre: string, visible: string }] } | null>(null);
    const [loading, setLoading] = useState(true);

    // Hook para obtener datos
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const result = await getDataDashboard();
                setData(result);
            } catch (error) {
                console.error("Error al obtener autoridades", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    // Solo la estructura básica del return (div principal y título)
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-red-700 mb-2">Panel de Administración</h1>
            <p className="text-gray-600 mb-6">Gestiona eventos, cursos y usuarios desde aquí</p>
        </div>
    );
}