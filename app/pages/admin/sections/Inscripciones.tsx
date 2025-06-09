"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, XCircle } from "lucide-react";
import { actualizarEstadoInscripcion } from "@/app/Services/eventoService";
import { getCalificaciones } from "@/app/Services/carreraService";

type Estudiante = {
    id_inscripcion: number;
    nombre: string;
    curso: string;
    estadoInscripcion: string;
    "carta de motivacion": string;
    "cedula y papeleta de botacion": string;
    "comprobante de pago": string;
};

type Curso = {
    nombre: string;
    estudiantes: Estudiante[];
};

export default function Inscripciones() {
    const [datos, setDatos] = useState<Estudiante[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCalificaciones();
            setDatos(data);
            // Agrupar por curso
            const agrupados: Record<string, Estudiante[]> = {};
            data.forEach((est: Estudiante) => {
                if (!agrupados[est.curso]) agrupados[est.curso] = [];
                agrupados[est.curso].push(est);
            });

            const listaCursos: Curso[] = Object.entries(agrupados).map(
                ([nombre, estudiantes]) => ({ nombre, estudiantes })
            );
            setCursos(listaCursos);
        };

        fetchData();
    }, []);

    const estudiantesFiltrados =
        cursos.find((c) => c.nombre === cursoSeleccionado)?.estudiantes ?? [];

    const handleActualizarEstado = async (estudianteId: number, estado: string) => {
        await actualizarEstadoInscripcion(estudianteId, { estado: estado });
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-red-700 mb-2">Gestión de Inscripciones</h1>
            <p className="text-gray-600 mb-6">Revisa, aprueba o rechaza inscripciones pendientes por curso</p>

            <Card className="mb-6">
                <CardContent className="p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Selecciona un curso:</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => setCursoSeleccionado(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>-- Selecciona un curso --</option>
                        {cursos.map((curso) => (
                            <option key={curso.nombre} value={curso.nombre}>
                                {curso.nombre}
                            </option>
                        ))}
                    </select>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {cursoSeleccionado
                            ? `Estudiantes en: ${cursoSeleccionado}`
                            : "Lista de Estudiantes"}
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border rounded-md overflow-hidden bg-white">
                            <thead className="bg-gray-100 text-left text-gray-700">
                                <tr>
                                    <th className="p-3 border">Nombre</th>
                                    <th className="p-3 border">Documentos PDF</th>
                                    <th className="p-3 border">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cursoSeleccionado && estudiantesFiltrados.length > 0 ? (
                                    estudiantesFiltrados.map((est) => (
                                        <tr key={est.id_inscripcion} className="hover:bg-gray-50">
                                            <td className="p-3 border">{est.nombre}</td>
                                            <td className="p-3 border space-y-1">
                                                {est["carta de motivacion"] && (
                                                    <div>
                                                        <a
                                                            href={est["carta de motivacion"]}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 underline hover:text-blue-800"
                                                        >
                                                            Carta de motivación
                                                        </a>
                                                    </div>
                                                )}
                                                {est["cedula y papeleta de botacion"] && (
                                                    <div>
                                                        <a
                                                            href={est["cedula y papeleta de botacion"]}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 underline hover:text-blue-800"
                                                        >
                                                            Cédula y papeleta
                                                        </a>
                                                    </div>
                                                )}
                                                {est["comprobante de pago"] && (
                                                    <div>
                                                        <a
                                                            href={est["comprobante de pago"]}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 underline hover:text-blue-800"
                                                        >
                                                            Comprobante de pago
                                                        </a>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3 border flex gap-2">
                                                <Button
                                                    onClick={() => handleActualizarEstado(est.id_inscripcion, "Aprobado")}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    <BadgeCheck className="w-4 h-4 mr-1" /> Aprobar
                                                </Button>
                                                <Button
                                                    onClick={() => handleActualizarEstado(est.id_inscripcion, "Rechazado")}
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    <XCircle className="w-4 h-4 mr-1" /> Rechazar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="p-4 text-center text-gray-500 italic">
                                            {cursoSeleccionado
                                                ? "No hay estudiantes pendientes en este curso."
                                                : "Selecciona un curso para ver estudiantes."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
