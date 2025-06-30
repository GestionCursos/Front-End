// components/SelectorOrganizador.tsx
'use client';
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OrganizadorForm } from "./Organizador";

interface Organizador {
    id: number;
    nombre: string;
    institucion: string;
}

interface SelectorOrganizadorProps {
    organizadores: Organizador[];
    selectedId: number | "";
    onSelect: (id: number) => void;
    onAdd: (nuevo: Organizador) => void;
}

export const SelectorOrganizador: React.FC<SelectorOrganizadorProps> = ({
    organizadores = [],
    selectedId,
    onSelect,
    onAdd
}) => {
    const [busqueda, setBusqueda] = React.useState("");
    const [formVisible, setFormVisible] = React.useState(false);

    const organizadoresFiltrados = organizadores.filter((org) =>
        `${org.nombre} ${org.institucion}`.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div>
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Buscar organizador..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full"
                />
                <Button
                    type="button"
                    onClick={() => setFormVisible(true)}
                    variant="outline"
                    size="icon"
                    title="Agregar organizador"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <select
                value={selectedId}
                onChange={(e) => onSelect(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mt-2 text-sm"
            >
                <option value="">Seleccionar organizador</option>
                {organizadoresFiltrados.map((org) => (
                    <option key={org.id} value={org.id}>
                        {org.nombre} - {org.institucion}
                    </option>
                ))}
            </select>

            {formVisible && (
                <OrganizadorForm
                    visible={formVisible}
                    onCancel={() => setFormVisible(false)}
                    onCreated={(nuevo) => {
                        const nuevoConId = { ...nuevo, id: Date.now() };
                        onAdd(nuevoConId);
                        onSelect(nuevoConId.id);
                        setFormVisible(false);
                    }}
                />
            )}
        </div>
    );
};
