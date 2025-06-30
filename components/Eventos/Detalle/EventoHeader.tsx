"use client";
export const runtime = 'edge';
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


interface EventoHeaderProps {
    nombre: string;
    urlFoto: string;
    tipoEvento: string;
    categoria: string;
    requiereAsistencia: number | null;
    descripcion: string;
}

export function EventoHeader({
    nombre,
    urlFoto,
    tipoEvento,
    categoria,
    requiereAsistencia,
    descripcion,
}: EventoHeaderProps) {
    return (

        <>
            <div className="relative h-96 rounded-xl overflow-hidden">
                <Image
                    src={urlFoto || "/placeholder.svg?height=400&width=600"}
                    alt={nombre}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex gap-2 mb-4">
                        <Badge variant="secondary">{tipoEvento}</Badge>
                        <Badge className="bg-primary">{categoria}</Badge>
                        {requiereAsistencia && (
                            <Badge variant="destructive">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Asistencia obligatoria con un minimo de {requiereAsistencia}%  de asistencia
                            </Badge>
                        )}
                        {!requiereAsistencia && (
                            <Badge variant="destructive">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Asistencia opcional
                            </Badge>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{nombre}</h1>
                </div>
                <h1 className="text-3xl font-bold mb-4">{nombre}</h1>
                <p className="text-lg text-muted-foreground mb-6">{descripcion}</p>
            </div>

            {/* Descripción completa */}
            <Card className="border-primary/10">
                <CardHeader>
                    <CardTitle>Descripción del evento</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm max-w-none">
                        {(descripcion || "").split("\n").map((paragraph: string, index: number) => (
                            <p key={index} className="mb-4 last:mb-0">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </CardContent>
            </Card>


        </>

    );
}
/*
       <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden">
            <Image
                src={urlFoto || "/placeholder.svg?height=400&width=600"}
                alt={nombre}
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">{tipoEvento}</Badge>
                    <Badge className="bg-primary">{categoria}</Badge>
                    <Badge variant="destructive">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {requiereAsistencia
                            ? `Asistencia obligatoria (${requiereAsistencia}%)`
                            : "Asistencia opcional"}
                    </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">{nombre}</h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1 line-clamp-2">
                    {descripcion}
                </p>
            </div>
        </div>
        */