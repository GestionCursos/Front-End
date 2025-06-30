import React, { useState, useEffect } from "react";

interface FechaFinProps {
    value: string;
    onChange: (value: string) => void;
    fechaInicio: string; // Para validar que fechaFin > fechaInicio + 1 mes
}

export function FechaFin({ value, onChange, fechaInicio }: FechaFinProps) {
    const [error, setError] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fechaSeleccionada = e.target.value;
        const fechaIni = new Date(fechaInicio);
        const fecha = new Date(fechaSeleccionada);

        const fechaMinima = new Date(fechaIni);
        fechaMinima.setMonth(fechaMinima.getMonth() + 1);

        if (fecha < fechaMinima) {
            setError("La fecha final debe ser al menos un mes después de la fecha de inicio.");
        } else {
            setError("");
            onChange(fechaSeleccionada);
        }
    };

    return (
        <div>
            <label className="block mb-1 font-medium">Fecha Fin</label>
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
