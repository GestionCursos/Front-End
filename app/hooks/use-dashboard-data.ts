"use client"

import { useState, useEffect, useCallback } from "react"
import { Colaborador } from "../models/EstadisticasACS"
import { Cambio } from "../models/EstadisticasACS"
import { EstadisticasEstados } from "../models/EstadisticasACS"
import { DatosEvolucion } from "../models/EstadisticasACS"
import { TipoCambio } from "../models/EstadisticasACS"
interface DashboardData {
    colaboradores: Colaborador[]
    cambios: Cambio[]
    estados: EstadisticasEstados[]
    datosEvolucion: DatosEvolucion[]
    tiposCambio: TipoCambio[]
}

interface UseDashboardDataReturn {
    data: DashboardData
    isLoading: boolean
    error: string | null
    refetch: () => void
}

const API_TIMEOUT = 10000 // 10 segundos

export function useDashboardData(): UseDashboardDataReturn {
    const [data, setData] = useState<DashboardData>({
        colaboradores: [],
        cambios: [],
        estados: [],
        datosEvolucion: [],
        tiposCambio: []
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchWithTimeout = useCallback(async (url: string, signal: AbortSignal) => {
        const response = await fetch(url, {
            signal,
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return response.json()
    }, [])

    const fetchAllData = useCallback(async () => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        if (!backendUrl) {
            throw new Error("NEXT_PUBLIC_BACKEND_URL no está configurada")
        }

        // Crear AbortController para cancelar requests si es necesario
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

        try {
            // Hacer todas las requests en paralelo
            const [colaboradoresRes, cambiosRes, estadosRes, evolucionRes, tiposCambio] = await Promise.allSettled([
                fetchWithTimeout(`${backendUrl}/estadisticas-itil`, controller.signal),
                fetchWithTimeout(`${backendUrl}/estadisticas-itil/cambios-recientes`, controller.signal),
                fetchWithTimeout(`${backendUrl}/estadisticas-itil/estados`, controller.signal),
                fetchWithTimeout(`${backendUrl}/estadisticas-itil/datosEvolucion`, controller.signal),
                fetchWithTimeout(`${backendUrl}/estadisticas-itil/tiposCambio`, controller.signal)
            ])

            clearTimeout(timeoutId)

            // Procesar resultados
            const newData: DashboardData = {
                colaboradores: colaboradoresRes.status === "fulfilled" ? colaboradoresRes.value.usuarios || [] : [],
                cambios: cambiosRes.status === "fulfilled" ? cambiosRes.value.cambiosRecientes || [] : [],
                estados: estadosRes.status === "fulfilled" ? estadosRes.value || [] : [],
                datosEvolucion: evolucionRes.status === "fulfilled" ? evolucionRes.value || [] : [],
                tiposCambio: tiposCambio.status === "fulfilled" ? tiposCambio.value || [] : [],
            }

            // Verificar si alguna request falló
            const failedRequests = [colaboradoresRes, cambiosRes, estadosRes, evolucionRes]
                .filter((result) => result.status === "rejected")
                .map((result) => (result as PromiseRejectedResult).reason.message)

            if (failedRequests.length > 0) {
                console.warn("Algunas requests fallaron:", failedRequests)
                // Solo mostrar error si todas las requests fallaron
                if (failedRequests.length === 4) {
                    throw new Error(`Todas las APIs fallaron: ${failedRequests.join(", ")}`)
                }
            }

            setData(newData)
            setError(null)
        } catch (err: any) {
            console.error("Error fetching dashboard data:", err)
            setError(err.name === "AbortError" ? "Request timeout" : err.message)

            // Mantener datos anteriores en caso de error
            if (data.colaboradores.length === 0) {
                // Solo usar fallback si no hay datos previos
                setData({
                    colaboradores: [],
                    cambios: [],
                    estados: [],
                    datosEvolucion: [],
                    tiposCambio: []
                })
            }
        } finally {
            clearTimeout(timeoutId)
            setIsLoading(false)
        }

        // Cleanup function
        return () => {
            controller.abort()
            clearTimeout(timeoutId)
        }
    }, [fetchWithTimeout, data.colaboradores.length])

    const refetch = useCallback(() => {
        setIsLoading(true)
        setError(null)
        fetchAllData()
    }, [fetchAllData])

    useEffect(() => {
        const cleanup = fetchAllData()
        return () => {
            if (cleanup instanceof Function) {
                cleanup()
            }
        }
    }, []) // Solo ejecutar una vez al montar

    return { data, isLoading, error, refetch }
}
