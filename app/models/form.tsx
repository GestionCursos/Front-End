import { Evento } from "./CrearEvento";
import { Organizador } from "./Curso";

export interface EventoFormProps {
    formData: Evento;
    setFormData: React.Dispatch<React.SetStateAction<Evento>>;
    imagen: File | null;
    setImagen: (file: File | null) => void;
    setImagenPreview: (url: string | null) => void;
    subiendo: boolean;
    setSubiendo: (value: boolean) => void;
    carreras: Array<{ id: number; nombre: string }>; // ejemplo de estructura
    organizadores: Organizador[];
    secciones: Array<{ id_seccion: number; nombre: string }>;
    requisitos: Array<{ id: number; nombre: string }>;
    setRequisitos: React.Dispatch<React.SetStateAction<Array<{ id: number; nombre: string }>>>;

}