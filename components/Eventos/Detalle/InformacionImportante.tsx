import { AlertCircle, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface InformacionImportanteProps {
    requiereAsistencia: boolean;
    notaAprovacion?: number | null;
}

/**
 * Componente que muestra información importante sobre un evento.
 * Solo se renderiza si hay información relevante que mostrar (asistencia obligatoria o nota mínima).
 * 
 * @param requiereAsistencia - Si el evento requiere asistencia presencial
 * @param notaAprovacion - Nota mínima para aprobar (puede ser null o undefined)
 */
export function InformacionImportante({ requiereAsistencia, notaAprovacion }: InformacionImportanteProps) {
    // Solo mostrar si hay información relevante que mostrar
    const tieneInformacionRelevante = requiereAsistencia || (notaAprovacion !== null && notaAprovacion !== undefined && notaAprovacion > 0);
    
    // Si no hay información relevante, no mostrar el componente
    if (!tieneInformacionRelevante) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Información importante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Solo mostrar información de asistencia si es obligatoria */}
                {requiereAsistencia && (
                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-orange-800">Asistencia obligatoria</h4>
                            <p className="text-sm text-orange-700">
                                Este evento requiere asistencia presencial para obtener la certificación.
                            </p>
                        </div>
                    </div>
                )}

                {/* Solo mostrar información de nota si existe y es mayor a 0 */}
                {notaAprovacion !== null && notaAprovacion !== undefined && notaAprovacion > 0 && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Star className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-800">Nota mínima de aprobación</h4>
                            <p className="text-sm text-blue-700">
                                Necesitas obtener al menos {notaAprovacion} puntos para aprobar este evento.
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
