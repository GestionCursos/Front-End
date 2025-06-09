'use client'
import '@/app/globals.css'
import { Curso } from '@/app/models/Curso'
import { calificarEstudiante, generarCertificados } from '@/app/Services/eventoService'
import { getEventos } from '@/app/Services/reporteService'
import { obtenerListaUsuarios } from '@/app/Services/usuarioService'
import React, { useState, useEffect } from 'react'



export default function Calificacion() {
    const [cursoSeleccionado, setCursoSeleccionado] = useState<number | null>(null)
    const [calificaciones, setCalificaciones] = useState<{ [id: string]: { nota: string; asistencia: string } }>({})
    const [cursos, setCursos] = useState<Curso[]>([])
    const [estudiantes, setEstudiantes] = useState<{
        nota_aprovacion: string | null,
        requiere_asistencia: string | null,
        usuarios: { id: number, nombre: string }[]
    }>({ nota_aprovacion: null, requiere_asistencia: null, usuarios: [] })

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const data = await getEventos();
                setCursos(data);
            } catch (error) {
                console.error("Error al cargar cursos:", error);
            }
        };

        fetchCursos();
    }, []);
    useEffect(() => {
        const fecthEstudiantes = async () => {
            if (cursoSeleccionado !== null) {
                const userss = await obtenerListaUsuarios(cursoSeleccionado);
                console.log(userss)
                setEstudiantes(userss)
            } else {
                setEstudiantes({
                    nota_aprovacion: null,
                    requiere_asistencia: null,
                    usuarios: []
                })
            }
            setCalificaciones({})
        }
        fecthEstudiantes();
    }, [cursoSeleccionado])

    const handleInputChange = (estudianteId: number, campo: 'nota' | 'asistencia', valor: string) => {
        setCalificaciones(prev => ({
            ...prev,
            [estudianteId]: {
                ...prev[estudianteId],
                [campo]: valor,
            },
        }))
    }

    const handleGuardar = async (id: number) => {
        await calificarEstudiante({
            asistencia: Number(calificaciones[id].asistencia),
            nota: Number(calificaciones[id].nota),
            idInscripcion: id
        });
    }
    const handleGuardarTodo = async () => {
        for (const estudiante of estudiantes.usuarios) {
            const calificacion = calificaciones[estudiante.id];

            // Validaciones dinámicas
            const requiereNota = estudiantes.nota_aprovacion !== null;
            const requiereAsistencia = estudiantes.requiere_asistencia !== null;

            const notaValida = requiereNota ? !!calificacion?.nota : true;
            const asistenciaValida = requiereAsistencia ? !!calificacion?.asistencia : true;

            if (notaValida && asistenciaValida) {
                try {
                    await handleGuardar(estudiante.id);
                } catch (error) {
                    console.error(` Error al guardar para ${estudiante.nombre}:`, error);
                }
            }
        }
    };

    const handleComprobarYGenerarCertificados = async () => {
        const requiereNota = estudiantes.nota_aprovacion !== null;
        const requiereAsistencia = estudiantes.requiere_asistencia !== null;

        const todosCalificados = estudiantes.usuarios.every(estudiante => {
            const calificacion = calificaciones[estudiante.id];
            const notaValida = requiereNota ? !!calificacion?.nota : true;
            const asistenciaValida = requiereAsistencia ? !!calificacion?.asistencia : true;
            return notaValida && asistenciaValida;
        });

        if (todosCalificados) {
            if (cursoSeleccionado !== null) {
                await generarCertificados({ idEvento: cursoSeleccionado });
            } else {
                alert("Debes seleccionar un curso antes de generar certificados.");
            }
        } else {
            alert("Aún hay estudiantes sin calificar.");
        }
    };

    return (
        <div className="p-6 bg-white rounded-md shadow-sm">
            <h1 className="text-2xl font-bold text-red-700 mb-6">Calificar Estudiantes</h1>

            <div className="mb-6">
                <label className="block mb-2 text-gray-800 font-medium">Selecciona un curso:</label>
                <select
                    className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-300"
                    onChange={(e) => setCursoSeleccionado(Number(e.target.value))}
                >
                    <option value="">-- Selecciona --</option>
                    {cursos.map(curso => (
                        <option key={curso.id_evento} value={curso.id_evento}>{curso.nombre}</option>
                    ))}
                </select>
            </div>

            {estudiantes?.usuarios?.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800">Estudiantes inscritos</h2>

                    {estudiantes.usuarios.map(estudiante => (
                        <div key={estudiante.id} className="p-4 bg-red-50 border border-red-200 rounded-md shadow-sm">
                            <p className="font-medium text-red-700">{estudiante.nombre}</p>
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {estudiantes.nota_aprovacion && (
                                    <input
                                        type="number"
                                        placeholder="Nota total"
                                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                                        value={calificaciones[estudiante.id]?.nota || ''}
                                        onChange={(e) => handleInputChange(estudiante.id, 'nota', e.target.value)}
                                    />
                                )}
                                {estudiantes.requiere_asistencia && (
                                    <input
                                        type="number"
                                        placeholder="Asistencia (%)"
                                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                                        value={calificaciones[estudiante.id]?.asistencia || ''}
                                        onChange={(e) => handleInputChange(estudiante.id, 'asistencia', e.target.value)}
                                    />
                                )}

                            </div>
                        </div>
                    ))}

                    <button
                        className="mt-6 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-md shadow"
                        onClick={handleGuardarTodo}

                    >
                        Guardar Calificaciones
                    </button>

                </div>
            )}
            <button
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md shadow"
                onClick={handleComprobarYGenerarCertificados}
            >
                Comprobar y Generar Certificados
            </button>
        </div>
    )
}
