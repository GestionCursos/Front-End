'use client';
import React from 'react';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function DatosAplicacion({ value, onChange }: Props) {
  return (
    <div className="space-y-4 border-t pt-6">
      <h2 className="text-xl font-semibold text-primary dark:text-white">Datos de la Aplicación</h2>

      <div>
        <label htmlFor="apartado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Apartado afectado
        </label>
        <select
          id="apartado"
          name="apartado"
          value={value}
          onChange={onChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Seleccionar apartado</option>
          <option value="Home">Home</option>
          <option value="Login">Login</option>
          <option value="Eventos">Eventos</option>
        </select>
      </div>
    </div>
  );
}
