import React, { useState, useEffect } from "react";

interface FechaInicioProps {
    value: string;
    onChange: (value: string) => void;
}

export function FechaInicio({ value, onChange }: FechaInicioProps) {
    const [error, setError] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fechaSeleccionada = e.target.value;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fecha = new Date(fechaSeleccionada);

        if (fecha.getTime() < hoy.getTime()) {
            setError("La fecha de inicio no puede ser menor al día actual.");
        } else {
            setError("");
            onChange(fechaSeleccionada);
        }
    };

    return (
        <div>
            <label className="block mb-1 font-medium">Fecha Inicio</label>
            <input
                type="date"
                value={value}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-sm ${error ? "border-red-500" : "border-gray-300"}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
