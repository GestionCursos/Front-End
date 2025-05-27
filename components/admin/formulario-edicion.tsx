import { Autoridad } from "@/app/models/Autoridad";

type FormularioEdicionProps = {
    setEditando: React.Dispatch<React.SetStateAction<Autoridad | null>>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Autoridad>>>;
    setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
    setFotoFile: React.Dispatch<React.SetStateAction<File | null>>;

    formData: Partial<Autoridad>;
    previewUrl: string | null;
    fotoFile: File | null;

    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleGuardar: () => void;
    autoridad: Autoridad;
};

export const FormularioEdicion = ({
    setEditando,
    formData,
    handleChange,
    fotoFile,
    handleFileChange,
    previewUrl,
    handleGuardar
}: FormularioEdicionProps) => {
}