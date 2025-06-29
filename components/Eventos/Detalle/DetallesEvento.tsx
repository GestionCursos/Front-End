import { Calendar, Clock, MapPin, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatFecha, formatHora } from "@/app/utils/Funciones";

interface DetallesEventoProps {
    fechaInicio: string;
    fechaFin: string;
    duracionDias: number;
    numeroHoras: number;
    modalidad: string;
}

export function DetallesEvento({
    fechaInicio,
    fechaFin,
    duracionDias,
    numeroHoras,
    modalidad,
}: DetallesEventoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Detalles del evento
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-medium mb-1">Fecha de inicio</h4>
                    <p className="text-sm text-muted-foreground capitalize">{formatFecha(fechaInicio)}</p>
                    <p className="text-sm text-muted-foreground">{formatHora(fechaInicio)}</p>
                </div>

                <Separator />

                <div>
                    <h4 className="font-medium mb-1">Fecha de finalización</h4>
                    <p className="text-sm text-muted-foreground capitalize">{formatFecha(fechaFin)}</p>
                    <p className="text-sm text-muted-foreground">{formatHora(fechaFin)}</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm">Duración</span>
                    </div>
                    <span className="font-medium">{duracionDias} días</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm">Horas académicas</span>
                    </div>
                    <span className="font-medium">{numeroHoras}h</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm">Modalidad</span>
                    </div>
                    <Badge variant="outline">{modalidad}</Badge>
                </div>
            </CardContent>
        </Card>
    );
}
