"use client";
import '@/app/globals.css';
import { Seccion } from '@/app/models/Sections';
import { createSeccion, deleteSeccion, updateSeccion } from '@/app/Services/secciones';

import React, { useEffect, useState } from "react";
//import { getSecciones, createSeccion, updateSeccion, deleteSeccion } from "@/app/Services/seccionesService";

export default function Secciones() {
    const [data, setData] = useState<Seccion[]>([]);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState<Seccion | null>(null);
    const [formData, setFormData] = useState<Partial<Seccion>>({});
    const [creando, setCreando] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const raw = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/secciones`).then(res => res.json());
                const parsed = raw.map((s: any) => ({
                    id_seccion: s.id_seccion,
                    nombre: s.nombre,
                    descripcion: s.descripcion,
                    icono_url: s.icono_url,
                }));
                setData(parsed);
            } catch (error) {
                console.error("Error al obtener secciones", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleEditar = (id: number) => {
        const seccion = data.find(s => s.id_seccion === id);
        if (seccion) {
            setEditando(seccion);
            setFormData(seccion);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };
    const handleGuardar = async () => {
        if (!editando) return;
        try {
             await updateSeccion(editando.id_seccion, formData);
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/secciones`);
        const raw = await res.json();
        const updated = raw.map((s: any) => ({
            id: s.id_seccion,
            nombre: s.nombre,
            descripcion: s.descripcion,
            icono_url: s.icono_url,
        }));
        setData(updated);
        setEditando(null);
        } catch (error) {
            console.error("Error al actualizar sección", error);
        }
    };

    const handleGuardarNueva = async () => {
        try {
            const nueva = await createSeccion({
                ...formData,
            } as Omit<Seccion, "id">);
            setData(prev => [...prev, nueva]);
            setFormData({});
            setCreando(false);
        } catch (error) {
            console.error("Error al crear sección", error);
        }
    };


    const handleEliminar = async (id: number) => {
        if (!confirm("¿Eliminar esta sección?")) return;
        try {
            await deleteSeccion(id);
            setData(prev => prev.filter(s => s.id_seccion !== id));
        } catch (error) {
            console.error("Error al eliminar sección", error);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Lista de Secciones</h1>
                <button
                    onClick={() => {
                        setFormData({});
                        setCreando(true);
                        setEditando(null);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Crear Sección
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">Cargando secciones...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((seccion) => (
                        <div key={seccion.id_seccion} className="bg-white shadow-md rounded-xl p-4 text-center flex flex-col items-center">
                            <img
                                src={seccion.icono_url}
                                alt={seccion.nombre}
                                className="w-16 h-16 object-contain mb-2"
                            />
                            <h2 className="text-lg font-bold">{seccion.nombre}</h2>
                            <p className="text-sm text-gray-600 mb-2">{seccion.descripcion}</p>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleEditar(seccion.id_seccion)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(seccion.id_seccion)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {(editando || creando) && (
                <div className="bg-white p-6 shadow-md rounded-lg mt-6">
                    <h2 className="text-xl font-semibold mb-4">{editando ? 'Editar Sección' : 'Nueva Sección'}</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={formData.nombre || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <textarea
                            name="descripcion"
                            placeholder="Descripción"
                            value={formData.descripcion || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="icono_url"
                            placeholder="URL del Ícono"
                            value={formData.icono_url || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={editando ? handleGuardar : handleGuardarNueva}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={() => { setEditando(null); setCreando(false); }}
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
