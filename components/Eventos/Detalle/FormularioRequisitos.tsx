import { Button } from "@/components/ui/button";
import User from "@/app/models/User";
import FirebaseService from "@/app/Services/firebase/FirebaseService";
import StorageNavegador from "@/app/Services/StorageNavegador";

interface Requisito {
    idRequisito: number;
    nombre: string;
}

interface FormularioRequisitosProps {
    requisitos: Requisito[];
    archivosRequisitos: { [key: number]: File | null };
    setArchivosRequisitos: React.Dispatch<React.SetStateAction<{ [key: number]: File | null }>>;
    onEnviar: (uploadedUrls: { [key: number]: string | null }) => void;
    onCancelar: () => void;
}

export function FormularioRequisitos({
    requisitos,
    archivosRequisitos,
    setArchivosRequisitos,
    onEnviar,
    onCancelar,
}: FormularioRequisitosProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg space-y-4">
                <h2 className="text-xl font-bold">Sube los documentos requeridos</h2>
                {requisitos.map((req) => (
                    <div key={req.idRequisito} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">{req.nombre}</label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setArchivosRequisitos((prev) => ({
                                    ...prev,
                                    [req.idRequisito]: e.target.files?.[0] || null,
                                }))
                            }
                        />
                    </div>
                ))}
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onClick={onCancelar}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={async () => {
                            const user = StorageNavegador.getItemWithExpiry("user") as User;
                            if (user) {
                                const uploadedUrls: { [key: number]: string | null } = {};
                                for (const [idRequisito, file] of Object.entries(archivosRequisitos)) {
                                    if (file) {
                                        const url = await FirebaseService.uploadFile(
                                            file,
                                            user.username ? user.username : "",
                                            file.name
                                        );
                                        uploadedUrls[Number(idRequisito)] = url;
                                    }
                                }
                                onEnviar(uploadedUrls);
                            } else {
                                // Aquí deberías manejar que el usuario no está logueado si es necesario
                            }
                        }}
                    >
                        Enviar y confirmar inscripción
                    </Button>
                </div>
            </div>
        </div>
    );
}
