'use client';
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FirebaseService from "@/app/Services/firebase/FirebaseService";
import { actualizarEvento, getEventoPorId } from "@/app/Services/eventoService";
import { FechaInicio } from "../../FechaInicio";
import { FechaFin } from "../../FechaFin";
import { CalendarDays, Clock, DollarSign, MapPin, Users, FileText, Save, X } from "lucide-react";
import Image from "next/image";

export const CATEGORIAS = [
    "Software",
    "Medicina", 
    "Educación",
    "Ingeniería",
    "Cultura",
    "Deportes",
];

export const MODALIDADES = [
    "Presencial",
    "Virtual", 
    "Híbrida"
];

interface EditarEventoFormProps {
    eventoId: number;
    onClose: () => void;
    onSuccess: () => void;
}

// Interfaz para los datos de actualización del evento
interface ActualizarEventoData {
    nombre: string;
    tipoEvento: string;
    fechaInicio: string;
    fechaFin: string;
    modalidad: string;
    costo: number;
    categoria: string;
    numeroHoras: number;
    notaAprovacion: number | null;
    requiereAsistencia: number | null;
    urlFoto: string;
    visible: boolean;
    descripcion: string;
}

// Función para convertir fecha ISO a formato YYYY-MM-DD
const formatearFechaParaInput = (fecha: string | Date): string => {
    if (!fecha) return "";
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) return "";
    
    // Usar la fecha local para evitar problemas de zona horaria
    const year = fechaObj.getFullYear();
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

// Función para convertir fecha de input a formato ISO para el backend
const formatearFechaParaBackend = (fecha: string): string => {
    if (!fecha) return "";
    // Crear la fecha en la zona horaria local y luego convertir a ISO
    const [year, month, day] = fecha.split('-').map(Number);
    const fechaObj = new Date(year, month - 1, day, 0, 0, 0, 0);
    return fechaObj.toISOString();
};

export function EditarEventoForm({ eventoId, onClose, onSuccess }: EditarEventoFormProps) {
    const [formData, setFormData] = useState({
        nombre: "",
        tipoEvento: "",
        fechaInicio: "",
        fechaFin: "",
        modalidad: "",
        costo: 0,
        categoria: "",
        numeroHoras: "",
        notaAprovacion: null as number | null,
        requiereAsistencia: null as number | null,
        urlFoto: "",
        descripcion: "",
        visible: true
    });

    const [imagen, setImagen] = useState<File | null>(null);
    const [imagenPreview, setImagenPreview] = useState<string>("");
    const [subiendo, setSubiendo] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar datos del evento
    useEffect(() => {
        const cargarEvento = async () => {
            try {
                setCargando(true);
                const evento = await getEventoPorId(eventoId.toString());
                if (evento) {
                    setFormData({
                        nombre: evento.nombre || "",
                        tipoEvento: evento.tipoEvento || "",
                        fechaInicio: formatearFechaParaInput(evento.fechaInicio),
                        fechaFin: formatearFechaParaInput(evento.fechaFin),
                        modalidad: evento.modalidad || "",
                        costo: evento.costo || 0,
                        categoria: evento.categoria || "",
                        numeroHoras: evento.numeroHoras?.toString() || "",
                        notaAprovacion: evento.notaAprovacion || null,
                        requiereAsistencia: evento.requiereAsistencia || null,
                        urlFoto: evento.urlFoto || "",
                        descripcion: evento.descripcion || "",
                        visible: evento.visible !== false
                    });
                    setImagenPreview(evento.urlFoto || "");
                }
            } catch (err) {
                console.error("Error al cargar evento:", err);
                setError("Error al cargar los datos del evento");
            } finally {
                setCargando(false);
            }
        };

        cargarEvento();
    }, [eventoId]);

    // Verificar si la fecha de inicio ya pasó
    const fechaInicioPasada = () => {
        if (!formData.fechaInicio) return false;
        const fechaInicio = new Date(formData.fechaInicio + 'T00:00:00');
        const ahora = new Date();
        ahora.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
        return fechaInicio < ahora;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let val: any = value;

        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            val = e.target.checked;
        }

        // Campos numéricos
        const numericFields = ["costo", "notaAprovacion", "requiereAsistencia"];
        if (numericFields.includes(name)) {
            if (name === "requiereAsistencia") {
                // Permitir valor vacío, no convertir a 0 automáticamente
                if (value === "") {
                    val = "";
                } else {
                    val = Number(value);
                    // Asegurarse de que esté en el rango 0-100
                    if (val < 0 || val > 100) return;
                }
            } else if (name === "notaAprovacion") {
                // Permitir valor vacío, no convertir a 0 automáticamente
                if (value === "") {
                    val = "";
                } else {
                    val = Number(value);
                    if (val < 0 || val > 100) return;
                }
            } else {
                val = value === "" ? 0 : Number(value);
                if (name === "costo" && val < 0) return;
            }
        }

        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setImagen(file);
            setImagenPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (fechaInicioPasada()) {
            setError("No se puede editar un evento que ya ha comenzado");
            return;
        }

        try {
            setSubiendo(true);
            setError(null);

            let urlFoto = formData.urlFoto;

            // Si se seleccionó una nueva imagen, subirla
            if (imagen) {
                const nuevaUrl = await FirebaseService.uploadFile(imagen, "eventos", imagen.name);
                if (!nuevaUrl) throw new Error("No se pudo subir la imagen");
                urlFoto = nuevaUrl;
            }

            // Actualizar evento
            const datosParaActualizar: any = {
                nombre: formData.nombre,
                tipoEvento: formData.tipoEvento,
                fechaInicio: formatearFechaParaBackend(formData.fechaInicio),
                fechaFin: formatearFechaParaBackend(formData.fechaFin),
                modalidad: formData.modalidad,
                costo: formData.costo,
                categoria: formData.categoria,
                numeroHoras: parseInt(formData.numeroHoras) || 0,
                urlFoto: urlFoto,
                visible: formData.visible,
                descripcion: formData.descripcion
            };
            
            // Solo incluir requiereAsistencia si no es null (checkbox marcado)
            if (formData.requiereAsistencia !== null) {
                datosParaActualizar.requiereAsistencia = formData.requiereAsistencia;
            }
            
            // Solo incluir notaAprovacion si no es null (checkbox marcado)
            if (formData.notaAprovacion !== null) {
                datosParaActualizar.notaAprovacion = formData.notaAprovacion;
            }
            
            await actualizarEvento(eventoId, datosParaActualizar);
            onSuccess();
            
        } catch (err: any) {
            console.error("Error al actualizar evento:", err);
            let errorMessage = "Error al actualizar el evento";
            
            if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setSubiendo(false);
        }
    };

    if (cargando) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-96">
                    <CardContent className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Cargando datos del evento...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (fechaInicioPasada()) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-96">
                    <CardHeader>
                        <CardTitle className="text-center text-red-600">No se puede editar</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="mb-4">Este evento ya ha comenzado y no puede ser editado.</p>
                        <Button onClick={onClose} variant="outline">
                            Cerrar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="sticky top-0 bg-white border-b z-10">
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Editar Evento
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                
                <CardContent className="p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Información básica */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="nombre" className="font-semibold">Nombre del evento *</Label>
                                    <Input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        className="mt-1"
                                        placeholder="Ingrese el nombre del evento"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="tipoEvento" className="font-semibold">Tipo de evento *</Label>
                                    <Select value={formData.tipoEvento} onValueChange={(value) => handleSelectChange("tipoEvento", value)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Seleccione el tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GRATUITO">Gratuito</SelectItem>
                                            <SelectItem value="PAGADO">Pagado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="categoria" className="font-semibold">Categoría *</Label>
                                    <Select value={formData.categoria} onValueChange={(value) => handleSelectChange("categoria", value)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Seleccione la categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIAS.map((categoria) => (
                                                <SelectItem key={categoria} value={categoria}>
                                                    {categoria}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="modalidad" className="font-semibold">Modalidad *</Label>
                                    <Select value={formData.modalidad} onValueChange={(value) => handleSelectChange("modalidad", value)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Seleccione la modalidad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MODALIDADES.map((modalidad) => (
                                                <SelectItem key={modalidad} value={modalidad}>
                                                    {modalidad}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label className="font-semibold">Imagen del evento</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="mt-1"
                                    />
                                    {imagenPreview && (
                                        <div className="mt-2">
                                            <Image
                                                src={imagenPreview}
                                                alt="Preview"
                                                width={200}
                                                height={120}
                                                className="rounded border object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="costo" className="font-semibold flex items-center gap-1">
                                            <DollarSign className="h-4 w-4" />
                                            Costo
                                        </Label>
                                        <Input
                                            id="costo"
                                            name="costo"
                                            type="number"
                                            min="0"
                                            value={formData.costo}
                                            onChange={handleChange}
                                            className="mt-1"
                                            disabled={formData.tipoEvento === "GRATUITO"}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="numeroHoras" className="font-semibold flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            Horas
                                        </Label>
                                        <Input
                                            id="numeroHoras"
                                            name="numeroHoras"
                                            type="number"
                                            min="1"
                                            value={formData.numeroHoras}
                                            onChange={handleChange}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fechas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="font-semibold flex items-center gap-1">
                                    <CalendarDays className="h-4 w-4" />
                                    Fecha de inicio *
                                </Label>
                                <FechaInicio 
                                    value={formData.fechaInicio}
                                    onChange={(fecha) => setFormData(prev => ({ ...prev, fechaInicio: fecha }))}
                                />
                            </div>

                            <div>
                                <Label className="font-semibold flex items-center gap-1">
                                    <CalendarDays className="h-4 w-4" />
                                    Fecha de fin *
                                </Label>
                                <FechaFin 
                                    value={formData.fechaFin}
                                    onChange={(fecha) => setFormData(prev => ({ ...prev, fechaFin: fecha }))}
                                    fechaInicio={formData.fechaInicio}
                                />
                            </div>
                        </div>

                        {/* Configuraciones adicionales */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Configuraciones de Evaluación
                                </h3>
                                
                                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                    {/* Control de Asistencia */}
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                name="requiereAsistenciaCheckbox"
                                                checked={formData.requiereAsistencia !== null}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        requiereAsistencia: e.target.checked ? 0 : null
                                                    }));
                                                }}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm font-medium">Requiere asistencia</span>
                                        </label>

                                        {formData.requiereAsistencia !== null && (
                                            <div>
                                                <Label className="block mb-1 font-medium">Porcentaje de asistencia requerido (%)</Label>
                                                <Input
                                                    name="requiereAsistencia"
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    placeholder="Ej: 80"
                                                    value={formData.requiereAsistencia ?? ""}
                                                    onChange={handleChange}
                                                    className="w-32"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Porcentaje mínimo de asistencia que debe tener un participante para aprobar
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Nota de Aprobación */}
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                name="notaAprovacionCheckbox"
                                                checked={formData.notaAprovacion !== null}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        notaAprovacion: e.target.checked ? 70 : null,
                                                    }));
                                                }}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm font-medium">Requiere nota mínima de aprobación</span>
                                        </label>

                                        {formData.notaAprovacion !== null && (
                                            <div>
                                                <Label className="block mb-1 font-medium">Nota mínima (0-100)</Label>
                                                <Input
                                                    name="notaAprovacion"
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    placeholder="Ej: 70"
                                                    value={formData.notaAprovacion ?? ""}
                                                    onChange={handleChange}
                                                    className="w-32"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Nota mínima que debe obtener un participante para aprobar
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <Label htmlFor="descripcion" className="font-semibold">Descripción del evento</Label>
                            <Textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                className="mt-1"
                                rows={4}
                                placeholder="Describe el evento, sus objetivos, contenido, etc."
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end space-x-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={subiendo}>
                                {subiendo ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar cambios
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
