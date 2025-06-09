import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FirebaseService from "@/app/Services/firebase/FirebaseService";
import { crearEvento } from "@/app/Services/eventoService";
import { FechaInicio } from "../FechaInicio";
import { FechaFin } from "../FechaFin";
import MultiSelectRestriccion from "./MultiSelectRestriccion";
import { EventoFormProps } from "@/app/models/form";
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
        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            val = e.target.checked;

            // Si se desactiva "requiere asistencia", limpiar el porcentaje
            if (name === "requiereAsistencia") {
                a.setFormData((prev) => ({
                    ...prev,
                    requiereAsistencia: (e.target as HTMLInputElement).checked ? 0 : null, // 0 o el valor por defecto
                }));
                return;
            }

            if (name === "requiereNotaAprobacion") {
                a.setFormData((prev) => ({
                    ...prev,
                    [name]: val,
                    notaAprovacion: (e.target as HTMLInputElement).checked ? 0 : null, // 0 o el valor por defecto
                }));
                return;
            }
            // Campos numéricos
            const numericFields = ["costo", "notaAprovacion", "numeroHoras", "idOrganizador", "idSeccion", "requiereAsistencia"];
            if (numericFields.includes(name)) {
                val = value === "" ? "" : Number(value);
                if (name === "costo" && val < 0) return;
            }

            a.setFormData((prev) => ({ ...prev, [name]: val }));

        }


        const numericFields = ["costo", "notaAprovacion", "numeroHoras", "idOrganizador", "idSeccion","requiereAsistencia"];
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
            <div>
                <label className="block mb-1 font-medium">Titulo</label>
                <Input name="nombre" placeholder="Nombre del evento" value={a.formData.nombre} onChange={handleChange} />
            </div>

            <div>
                <label className="block mb-1 font-medium">Tipo de Evento</label>
                <select
                    name="tipoEvento"
                    value={a.formData.tipoEvento}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                >
                    {["PAGADO", "GRATUITO"].map((tipo) => (
                        <option key={tipo} value={tipo}>
                            {tipo}
                        </option>
                    ))}
                </select>
            </div>

            <FechaInicio
                value={a.formData.fechaInicio}
                onChange={(val) => a.setFormData((prev: typeof a.formData) => ({ ...prev, fechaInicio: val }))}
            />

            <FechaFin
                value={a.formData.fechaFin}
                onChange={(val) => a.setFormData((prev: typeof a.formData) => ({ ...prev, fechaFin: val }))}
                fechaInicio={a.formData.fechaInicio}
            />
            {/* Seccion  para seleccionar el organizador del evento*/}
            <div>
                <label className="block mb-1 font-medium">Organizador</label>
                <select
                    name="idOrganizador"
                    value={a.formData.idOrganizador}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                >
                    <option value="">Seleccionar organizador</option>
                    {a.organizadores.map((org) => (
                        <option key={org.id} value={org.id}>
                            {org.nombre} - {org.institucion}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-1 font-medium">Tipo de Evento</label>
                <select
                    name="modalidad"
                    value={a.formData.modalidad}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                >
                    {["Online", "Presencial", "Hibrido"].map((tipo) => (
                        <option key={tipo} value={tipo}>
                            {tipo}
                        </option>
                    ))}
                </select>
            </div>

            <div>

                <label className="block mb-1 font-medium">Costo</label>
                <Input name="costo" type="number" min={0} placeholder="Costo" value={a.formData.costo} onChange={handleChange} />

            </div>
            <div>
                <label className="block mb-1 font-medium">Sección</label>
                <select name="idSeccion" value={a.formData.idSeccion} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
                    <option value="">Seleccionar sección</option>
                    {a.secciones.map((sec) => (
                        <option key={sec.id_seccion} value={sec.id_seccion}>
                            {sec.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block mb-1 font-medium">Categoría</label>
                <select name="categoria" value={a.formData.categoria} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
                    {CATEGORIAS.map((categoria) => (
                        <option key={categoria} value={categoria}>
                            {categoria}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-1 font-medium">Numero de Horas</label>
                <Input name="numeroHoras" type="number" min={0} placeholder="Número de horas" value={a.formData.numeroHoras} onChange={handleChange} />
            </div>

            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    name="notaAprovacion"
                    checked={a.formData.notaAprovacion != null}
                    onChange={handleChange}
                />
                <span className="text-sm">Requiere nota de aprobación</span>
            </label>
            {a.formData.notaAprovacion !== null  && (
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



            <label className="flex items-center space-x-2">
                <input type="checkbox" name="requiereAsistencia" checked={a.formData.requiereAsistencia !== null} onChange={handleChange} />
                <span className="text-sm">Requiere asistencia</span>
            </label>
            {a.formData.requiereAsistencia !== null  && (
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

            <textarea
                name="descripcion"
                placeholder="Descripción del evento"
                value={a.formData.descripcion}
                onChange={handleChange}
                className="w-full border rounded p-2 min-h-[80px]"
            />

            <MultiSelectRestriccion titulo="Carreras permitidas"
                items={a.carreras}
                selected={a.formData.facultades}
                onChange={(value) => a.setFormData((prev) => ({ ...prev, facultades: value }))}
                descripcionSinRestriccion="Sin restricción (todos pueden inscribirse)" />

            <MultiSelectRestriccion titulo="Requisitos adicionales para el evento"
                items={a.requisitos}
                selected={a.formData.requisitos}
                onChange={(value) => a.setFormData((prev) => ({ ...prev, requisitos: value }))}
                descripcionSinRestriccion="Sin restricción" />

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
