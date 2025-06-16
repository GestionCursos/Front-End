'use client';
import React, { useEffect, useState } from 'react';
import { getContenidoHome, updateContenidoHome } from '@/app/Services/contenidoHomeService';
import Image from 'next/image';

export default function MisionVision() {
    const [contenido, setContenido] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [editedContent, setEditedContent] = useState<any>({});

    useEffect(() => {
        async function fetchContenido() {
            try {
                const data = await getContenidoHome();
                setContenido(data);
            } catch (error) {
                console.error(error);
                setContenido([]);
            } finally {
                setLoading(false);
            }
        }
        fetchContenido();
    }, []);

    const openEditModal = (item: any) => {
        setSelectedItem(item);
        setEditedContent({ titulo: item.titulo, descripcion: item.descripcion });
    };

    const closeModal = () => {
        setSelectedItem(null);
        setEditedContent({});
    };

    const handleSave = async () => {
        try {
            await updateContenidoHome(selectedItem.id_contenido, editedContent);
            setContenido((prev) =>
                prev.map((item) =>
                    item.id_contenido === selectedItem.id_contenido
                        ? { ...item, ...editedContent }
                        : item
                )
            );
            closeModal();
        } catch (error) {
            console.error("Error al guardar los cambios", error);
        }
    };

    return (
        <div>
            <section className="py-16 bg-gradient-to-b from-primary/5 to-white">
                <div className="container px-4 mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center text-primary">Recursos destacados</h2>

                    {loading ? (
                        <p className="text-center">Cargando contenido...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {contenido.map((item) => (
                                <div
                                    key={item.id_contenido}
                                    className="bg-white rounded-2xl border-2 border-primary/20 shadow-md p-6"
                                >
                                    <h3 className="text-xl font-bold text-primary/90 mb-2">{item.titulo}</h3>
                                    <p className="text-muted-foreground mb-2">{item.descripcion}</p>
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className="text-blue-600 underline text-sm"
                                    >
                                        Editar
                                    </button>
                                    {item.url_foto && item.url_foto !== '.' && (
                                        <div className="mt-4">
                                            <Image
                                                src={item.url_foto}
                                                alt={item.titulo}
                                                width={240}
                                                height={140}
                                                className="rounded-lg border shadow-sm object-cover max-h-36"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Modal de edición */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-2xl relative border-2 border-primary/20">
                        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Editar contenido</h2>

                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Título</span>
                                <input
                                    type="text"
                                    value={editedContent.titulo}
                                    onChange={(e) => setEditedContent({ ...editedContent, titulo: e.target.value })}
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                    placeholder="Título del contenido"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Descripción</span>
                                <textarea
                                    value={editedContent.descripcion}
                                    onChange={(e) =>
                                        setEditedContent({ ...editedContent, descripcion: e.target.value })
                                    }
                                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm h-40 resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                    placeholder="Descripción del contenido"
                                />
                            </label>
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white shadow"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
