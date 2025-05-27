// Imports y configuración inicial
"use client";
import '@/app/globals.css';
import { Autoridad } from '@/app/models/Autoridad';
import { getAutoridades, updateAutoridades } from '@/app/Services/autoridadesService';
import FirebaseService from '@/app/Services/firebase/FirebaseService';
import { FormularioEdicion } from '@/components/admin/formulario-edicion';
import React, { useEffect, useState } from "react";

export default function Autoridade() {
// Estados y hooks
const [previewUrl, setPreviewUrl] = useState<string | null>(null);
const [data, setData] = useState<Autoridad[]>([]);
const [loading, setLoading] = useState(true);
const [editando, setEditando] = useState<Autoridad | null>(null);
const [formData, setFormData] = useState<Partial<Autoridad>>({});
const [fotoFile, setFotoFile] = useState<File | null>(null);

    // Lógica de negocio (todas las funciones)
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
            const updated = await updateAutoridades(editando.id_autoridad, {
                ...formData,
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

}