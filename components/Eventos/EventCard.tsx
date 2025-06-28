"use client";
export const runtime = 'edge';
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Calendar,
    MapPin,
} from "lucide-react"

export function EventCard({ event }: any) {
    return (
        <Card className="bg-white rounded-lg border border-primary/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48">
                <Image
                    src={event.urlFoto || "/placeholder.svg"}
                    alt={event.nombre}
                    fill
                    className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-primary">{event.categoria}</Badge>
            </div>
            <div className="p-6">
                <h3 className="font-bold text-lg mb-2 line-clamp-1">{event.nombre}</h3>
                <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{event.descripcion}</p>
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <p className="font-medium">
                            {event.fechaInicio
                                ? new Date(event.fechaInicio).toLocaleDateString() +
                                " " +
                                new Date(event.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : "Sin fecha"}
                        </p>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.modalidad}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{event.costo ? `$${event.costo}` : "Gratis"}</span>
                    <Button asChild className="auth-button">
                        <Link href={`/sections/events_detail/${event.id_evento}`}>Ver detalles</Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}
