// /components/CrearEvento/useCrearEvento.ts
import { useEffect, useState } from "react";
import { getCarreras, getRequisitos, getSecciones } from "@/app/Services/carreraService";
import { getOrganizadores } from "@/app/Services/organizadorService";
import { Evento, eventoInicial } from "@/app/models/CrearEvento";

export function useCrearEvento() {
    const [requisitos, setRequisitos] = useState<{ id: number; nombre: string; }[]>([]);
    const [imagenPreview, setImagenPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<Evento>(eventoInicial);
    const [imagen, setImagen] = useState<File | null>(null);
    const [subiendo, setSubiendo] = useState(false);
    const [carreras, setCarreras] = useState([]);
    const [organizadores, setOrganizadores] = useState([]);
    const [secciones, setSecciones] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [c, o, s, e] = await Promise.all([getCarreras(), getOrganizadores(), getSecciones(), getRequisitos()]);
            setCarreras(c);
            setOrganizadores(o);
            setSecciones(s);
            setRequisitos(e);
        };
        fetchData();
    }, []);

    return {
        formData,
        setFormData,
        imagen,
        setImagen,
        imagenPreview,
        setImagenPreview,
        subiendo,
        setSubiendo,
        carreras,
        organizadores,
        secciones,
        requisitos,
        setRequisitos
    };
}
