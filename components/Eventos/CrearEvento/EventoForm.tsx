'use client';
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FirebaseService from "@/app/Services/firebase/FirebaseService";
import { crearEvento } from "@/app/Services/eventoService";
import { FechaInicio } from "../../FechaInicio";
import { FechaFin } from "../../FechaFin";
import MultiSelectRestriccion from "./MultiSelectRestriccion";
import { EventoFormProps } from "@/app/models/form";
import { OrganizadorForm } from "./Organizador";
import { Plus } from "lucide-react";
import { SelectorOrganizador } from "./SelectorOrganizador";
export const CATEGORIAS = [
    "Software",
    "Medicina",
    "Educación",
    "Ingeniería",
    "Cultura",
    "Deportes",
];

export function EventoForm(a: EventoFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let val: any = value;

        if (name === "tipoEvento") {
            const nuevoTipo = value;
            a.setFormData((prev) => {
                const comprobante = a.requisitos.find((r) => r.nombre === "Comprobante de pago");
                if (!comprobante) return { ...prev, tipoEvento: nuevoTipo };
                const requisitosActuales = Array.isArray(prev.requisitos) ? prev.requisitos : [];
                const yaTieneComprobante = requisitosActuales.includes(comprobante.id);

                if (nuevoTipo === "PAGADO" && !yaTieneComprobante) {
                    return {
                        ...prev,
                        tipoEvento: nuevoTipo,
                        requisitos: [...requisitosActuales, comprobante.id],
                    };
                }

                if (nuevoTipo === "GRATUITO" && yaTieneComprobante) {
                    return {
                        ...prev,
                        tipoEvento: nuevoTipo,
                        requisitos: requisitosActuales.filter((id) => id !== comprobante.id),
                        costo: nuevoTipo === "GRATUITO" ? 0 : prev.costo, // fuerza costo = 0 si es gratuito
                    };
                }
                return { ...prev, tipoEvento: nuevoTipo };
            });
            return;
        }

        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            val = e.target.checked;
            // Campos numéricos
            const numericFields = ["costo", "notaAprovacion", "numeroHoras", "idOrganizador", "idSeccion", "requiereAsistencia"];
            if (numericFields.includes(name)) {
                val = value === "" ? "" : Number(value);
                if (name === "costo" && val < 0) return;
            }
            a.setFormData((prev) => ({ ...prev, [name]: val }));
        }

        const numericFields = ["costo", "notaAprovacion", "numeroHoras", "idOrganizador", "idSeccion", "requiereAsistencia"];
        if (numericFields.includes(name)) {
            val = value === "" ? "" : Number(value);
            if (name === "costo" && val < 0) return;
        }
        a.setFormData((prev) => ({ ...prev, [name]: val }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            a.setImagen(file);
            a.setImagenPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (a.imagen) {
                a.setSubiendo(true);
                const url = await FirebaseService.uploadFile(a.imagen, "eventos", a.imagen.name);
                if (!url) throw new Error("No se pudo subir la imagen");
                await crearEvento({ ...a.formData, urlFoto: url });
                alert("Evento creado con éxito");
            }
        } catch (err) {
            console.error(err);
            alert("Error al crear el evento");
        } finally {
            a.setSubiendo(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
            {/* Título */}
            <div>
                <label className="block mb-1 font-medium">Titulo</label>
                <Input name="nombre" placeholder="Nombre del evento" value={a.formData.nombre} onChange={handleChange} />
            </div>

            {/* Tipo de evento y modalidad */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                    <label className="block mb-1 font-medium">Tipo de Evento</label>
                    <select
                        name="tipoEvento"
                        value={a.formData.tipoEvento}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                    >
                        {["PAGADO", "GRATUITO"].map((tipo) => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>
                <div className="w-full md:w-1/2">
                    <label className="block mb-1 font-medium">Modalidad</label>
                    <select
                        name="modalidad"
                        value={a.formData.modalidad}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                    >
                        {["Online", "Presencial", "Hibrido"].map((tipo) => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Fechas */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                    <FechaInicio
                        value={a.formData.fechaInicio}
                        onChange={(val) => a.setFormData((prev) => ({ ...prev, fechaInicio: val }))}
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <FechaFin
                        value={a.formData.fechaFin}
                        onChange={(val) => a.setFormData((prev) => ({ ...prev, fechaFin: val }))}
                        fechaInicio={a.formData.fechaInicio}
                    />
                </div>
            </div>

            {/* Organizador y Sección */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                    <label className="block mb-1 font-medium">Organizador</label>
                    <SelectorOrganizador
                        organizadores={a.organizadores}
                        selectedId={a.formData.idOrganizador}
                        onSelect={(id) => a.setFormData((prev) => ({ ...prev, idOrganizador: id }))}
                        onAdd={(nuevo) => a.setOrganizadores((prev) => [...prev, nuevo])}
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <label className="block mb-1 font-medium">Sección</label>
                    <select
                        name="idSeccion"
                        value={a.formData.idSeccion}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                    >
                        <option value="">Seleccionar sección</option>
                        {a.secciones.map((sec) => (
                            <option key={sec.id_seccion} value={sec.id_seccion}>{sec.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Categoría y Costo */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                    <label className="block mb-1 font-medium">Categoría</label>
                    <select
                        name="categoria"
                        value={a.formData.categoria}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                    >
                        {CATEGORIAS.map((categoria) => (
                            <option key={categoria} value={categoria}>{categoria}</option>
                        ))}
                    </select>
                </div>
                <div className="w-full md:w-1/2">
                    <label className="block mb-1 font-medium">Costo</label>
                    <Input
                        name="costo"
                        type="number"
                        min={0}
                        placeholder="Costo"
                        value={a.formData.costo}
                        onChange={handleChange}
                        disabled={a.formData.tipoEvento === "GRATUITO"}
                    />
                </div>
            </div>
            {/* Número de horas */}
            <div>
                <label className="block mb-1 font-medium">Numero de Horas</label>
                <Input name="numeroHoras" type="number" min={0} placeholder="Número de horas" value={a.formData.numeroHoras} onChange={handleChange} />
            </div>
            {/* Nota de aprobación */}
            <div className="space-y-2">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="notaAprovacionCheckbox"
                        checked={a.formData.notaAprovacion != null}
                        onChange={(e) =>
                            a.setFormData((prev) => ({
                                ...prev,
                                notaAprovacion: e.target.checked ? 0 : null,
                            }))
                        }
                    />
                    <span className="text-sm">Requiere nota de aprobación</span>
                </label>
                {a.formData.notaAprovacion !== null && (
                    <div>
                        <label className="block mb-1 font-medium">Nota de Aprobación</label>
                        <Input
                            name="notaAprovacion"
                            type="number"
                            min={0}
                            max={100}
                            placeholder="Ej: 70"
                            value={a.formData.notaAprovacion ?? ""}
                            onChange={handleChange}
                        />
                    </div>
                )}
            </div>


            {/* Asistencia */}
            <div className="space-y-2">

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="requiereAsistenciaCheckbox"
                        checked={a.formData.requiereAsistencia !== null}
                        onChange={(e) =>
                            a.setFormData((prev) => ({
                                ...prev,
                                requiereAsistencia: e.target.checked ? 0 : null,
                            }))
                        }
                    />
                    <span className="text-sm">Requiere asistencia</span>
                </label>

                {a.formData.requiereAsistencia !== null && (
                    <div>
                        <label className="block mb-1 font-medium">Porcentaje de asistencia requerido (%)</label>
                        <Input
                            name="requiereAsistencia"
                            type="number"
                            min={0}
                            max={100}
                            placeholder="Ej: 80"
                            value={a.formData.requiereAsistencia ?? ""}
                            onChange={handleChange}
                        />
                    </div>
                )}
            </div>

            {/* Descripción */}
            <div>
                <label className="block mb-1 font-medium">Descripción</label>
                <textarea
                    name="descripcion"
                    placeholder="Descripción del evento"
                    value={a.formData.descripcion}
                    onChange={handleChange}
                    className="w-full border rounded p-2 min-h-[80px]"
                />
            </div>
            {/* Carreras permitidas */}

            <MultiSelectRestriccion titulo="Carreras permitidas"
                items={a.carreras}
                selected={a.formData.facultades}
                onChange={(value) => a.setFormData((prev) => ({ ...prev, facultades: value }))}
                descripcionSinRestriccion="Sin restricción (todos pueden inscribirse)" />
            {/* Requisitos adicionales */}
            <MultiSelectRestriccion
                titulo="Requisitos adicionales para el evento"
                items={a.requisitos}
                selected={a.formData.requisitos}
                onChange={(value) => {
                    const comprobante = a.requisitos.find((r) => r.nombre === "Comprobante de pago");

                    // Si no hay comprobante o value no es un array, salimos temprano
                    if (!comprobante || !Array.isArray(value)) {
                        a.setFormData((prev) => ({ ...prev, requisitos: value ?? [], tipoEvento: "GRATUITO" }));
                        return;
                    }

                    const tieneComprobante = value.includes(comprobante.id);

                    a.setFormData((prev) => ({
                        ...prev,
                        requisitos: value,
                        tipoEvento: tieneComprobante ? "PAGADO" : "GRATUITO",
                        costo: tieneComprobante ? prev.costo : 0,

                    }));
                }}
                descripcionSinRestriccion="Sin restricción"
            />
            {/* Imagen */}
            <div>
                <label className="block mb-1 font-medium">Imagen del evento</label>
                <Input type="file" onChange={handleFileChange} />
            </div>

            <Button type="submit" disabled={a.subiendo} className="w-full bg-red-600 hover:bg-red-700 text-white">
                {a.subiendo ? "Subiendo imagen..." : "Crear Evento"}
            </Button>
        </form>
    );
}
