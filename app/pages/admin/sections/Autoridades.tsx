"use client";
import '@/app/globals.css';
import { Autoridad } from '@/app/models/Autoridad';
import { createAutoridades, deleteAutoridades, getAutoridades, updateAutoridades } from '@/app/Services/autoridadesService';
import FirebaseService from '@/app/Services/firebase/FirebaseService';
import { FormularioEdicion } from '@/components/admin/formulario-edicion';
import React, { useEffect, useState } from "react";

export default function Autoridade() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [data, setData] = useState<Autoridad[]>([]);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState<Autoridad | null>(null);
    const [formData, setFormData] = useState<Partial<Autoridad>>({});
    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [creando, setCreando] = useState(false);

    useEffect(() => {
        const fetchAutoridades = async () => {
            try {
                const result = await getAutoridades();
                const visibles = result.filter((autoridad: Autoridad) => autoridad.visible);
                visibles.sort((a: Autoridad, b: Autoridad) => (a.orden ?? 0) - (b.orden ?? 0));
                setData(visibles);
            } catch (error) {
                console.error("Error al obtener autoridades", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAutoridades();
    }, []);

    const handleEditar = (id: number) => {
        const autoridad = data.find((a) => a.id_autoridad === id);
        if (autoridad) {
            setEditando(autoridad);
            setFormData(autoridad);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGuardar = async () => {
        let foto_url: string | null = null;
        if (fotoFile && editando?.cargo) {
            foto_url = await FirebaseService.uploadFile(fotoFile, 'autoridades', editando.cargo);
        }
        if (!editando) return;
        try {
              const { id_autoridad, ...restFormData } = formData;
            const updated = await updateAutoridades(editando.id_autoridad, {
                ...restFormData,
                ...(foto_url ? { foto_url } : {}),
            });
            setData(prev =>
                prev.map(item => item.id_autoridad === updated.id_autoridad ? updated : item)
            );
            setEditando(null);
        } catch (error) {
            console.error("Error al actualizar autoridad", error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setFotoFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            alert("El archivo debe ser JPG o PNG");
        }
    };

    const handleCrear = () => {
        setFormData({});
        setPreviewUrl(null);
        setFotoFile(null);
        setCreando(true);
    };
    const handleGuardarNueva = async () => {
        const getUltimoOrden = () => {
            if (data.length === 0) return 0;
            return Math.max(...data.map(a => a.orden ?? 0));
        };
        let foto_url: string | null = null;
        if (fotoFile && formData.cargo) {
            foto_url = await FirebaseService.uploadFile(fotoFile, 'autoridades', formData.cargo as string);
        }
        try {
            const nueva = await createAutoridades({
                ...formData,
                foto_url: foto_url ?? ""
            }, getUltimoOrden() + 1
            );
            setData(prev => [...prev, nueva]);
            setCreando(false);
            setFormData({});
            setFotoFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error("Error al crear autoridad", error);
        }
    };
    const handleEliminar = async (id: number) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta autoridad?")) return;
        try {
            await deleteAutoridades(id);
            setData(prev => prev.filter(a => a.id_autoridad !== id));
        } catch (error) {
            console.error("Error al eliminar autoridad", error);
        }
    };




    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Lista de Autoridades</h1>
                <button
                    onClick={handleCrear}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Crear Autoridad
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">Cargando autoridades...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((autoridad) => (
                        <div key={autoridad.id_autoridad} className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center">
                            <img
                                src={autoridad.foto_url}
                                alt={autoridad.nombre}
                                className="w-32 h-32 object-cover rounded-full mb-4"
                            />
                            <h2 className="text-lg font-bold">{autoridad.nombre}</h2>
                            <p className="text-sm text-gray-600 mb-2">{autoridad.cargo}</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line mb-4">{autoridad.descripcion}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditar(autoridad.id_autoridad)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(autoridad.id_autoridad)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editando && (
                <FormularioEdicion
                    autoridad={editando}
                    formData={formData}
                    setFormData={setFormData}
                    previewUrl={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                    fotoFile={fotoFile}
                    setFotoFile={setFotoFile}
                    handleChange={handleChange}
                    handleGuardar={handleGuardar}
                    handleFileChange={handleFileChange}
                    setEditando={setEditando}
                />
            )}


            {creando && (
                <FormularioEdicion
                    autoridad={null}
                    formData={formData}
                    setFormData={setFormData}
                    previewUrl={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                    fotoFile={fotoFile}
                    setFotoFile={setFotoFile}
                    handleChange={handleChange}
                    handleGuardar={handleGuardarNueva}
                    handleFileChange={handleFileChange}
                    setEditando={() => setCreando(false)}
                />
            )}
        </div>
    );
}
