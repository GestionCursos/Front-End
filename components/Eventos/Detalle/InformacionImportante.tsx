import { AlertCircle, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface InformacionImportanteProps {
    requiereAsistencia: boolean;
    notaAprovacion?: number | null;
}

export function InformacionImportante({ requiereAsistencia, notaAprovacion }: InformacionImportanteProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Información importante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {requiereAsistencia ? (
                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-orange-800">Asistencia obligatoria</h4>
                            <p className="text-sm text-orange-700">
                                Este evento requiere asistencia presencial para obtener la certificación.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-orange-800">Asistencia opcional</h4>
                            <p className="text-sm text-orange-700">
                                Este evento no requiere asistencia presencial para obtener la certificación.
                            </p>
                        </div>
                    </div>
                )}

                {notaAprovacion ? (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Star className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-800">Nota mínima de aprobación</h4>
                            <p className="text-sm text-blue-700">
                                Necesitas obtener al menos {notaAprovacion} puntos para aprobar este evento.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Star className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-800">Nota mínima de aprobación</h4>
                            <p className="text-sm text-blue-700">
                                Este evento no requiere una nota mínima de aprobación para obtener el certificado.
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
