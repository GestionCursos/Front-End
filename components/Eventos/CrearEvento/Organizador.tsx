// components/OrganizadorForm.tsx

import React from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { crearOrganizador } from "@/app/Services/organizadorService";
import { CreateOrganizadorDTO, Organizador } from "@/app/models/Organizador";

interface OrganizadorFormProps {
    visible: boolean;
    onCancel: () => void;
    onCreated: (organizador: Organizador) => void;
}

export const OrganizadorForm: React.FC<OrganizadorFormProps> = ({ visible, onCancel, onCreated }) => {
    const [nuevoOrganizador, setNuevoOrganizador] = React.useState({ nombre: "", institucion: "", correo: "" });

    const handleGuardar = async () => {
        if (!nuevoOrganizador.nombre.trim() || !nuevoOrganizador.institucion.trim()) {
            alert("Todos los campos son obligatorios");
            return;
        }
        try {
            const nuevoDTO: CreateOrganizadorDTO = {
                nombre: nuevoOrganizador.nombre,
                institucion: nuevoOrganizador.institucion,
                correo: nuevoOrganizador.correo
            };
            const nuevo = await crearOrganizador(nuevoDTO);
            onCreated(nuevo as Organizador);
            setNuevoOrganizador({ nombre: "", institucion: "", correo: "" });
        } catch (err) {
            console.error("Error al crear organizador:", err);
            alert("Hubo un error al crear el organizador");
        }
    };

    if (!visible) return null;

    return (
        <div className="border p-4 rounded mt-4 bg-gray-50">
            <h3 className="text-sm font-semibold mb-2">Nuevo Organizador</h3>

            <Input
                placeholder="Nombre del organizador"
                value={nuevoOrganizador.nombre}
                onChange={(e) => setNuevoOrganizador({ ...nuevoOrganizador, nombre: e.target.value })}
                className="mb-2"
            />
            <Input
                placeholder="Institución"
                value={nuevoOrganizador.institucion}
                onChange={(e) => setNuevoOrganizador({ ...nuevoOrganizador, institucion: e.target.value })}
                className="mb-2"
            />
            <Input
                placeholder="Correo"
                value={nuevoOrganizador.correo}
                onChange={(e) => setNuevoOrganizador({ ...nuevoOrganizador, correo: e.target.value })}
                className="mb-2"
            />

            <div className="flex space-x-2">
                <Button type="button" onClick={handleGuardar} className="bg-green-600 hover:bg-green-700 text-white">
                    Guardar
                </Button>
                <Button type="button" onClick={onCancel} variant="outline">
                    Cancelar
                </Button>
            </div>
        </div>
    );
};
