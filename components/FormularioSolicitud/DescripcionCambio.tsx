'use client';
import React from 'react';

interface Props {
  tipoCambio: string;
  otroTipo: string;
  descripcion: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function DescripcionCambio({ tipoCambio, otroTipo, descripcion, onChange }: Props) {
  const inputClass =
    'w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="space-y-6 border-t pt-6">
      <h2 className="text-xl font-semibold text-primary dark:text-white">Descripción del Cambio Solicitado</h2>

      <div className="space-y-4">
        <fieldset className="space-y-3">
          <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de cambio</legend>

          {[
            'Corrección de error',
            'Mejora / Nueva funcionalidad',
            'Cambios visuales / UX',
            'Otro',
          ].map((opcion) => (
            <label key={opcion} className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <input
                type="radio"
                name="tipoCambio"
                value={opcion}
                checked={tipoCambio === opcion}
                onChange={onChange}
                className="text-primary focus:ring-primary"
              />
              {opcion}
            </label>
          ))}

          {tipoCambio === 'Otro' && (
            <input
              type="text"
              name="otroTipo"
              placeholder="Especificar si eligió 'Otro'"
              value={otroTipo}
              onChange={onChange}
              className={inputClass}
            />
          )}
        </fieldset>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción detallada
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            placeholder="Incluya ejemplos, pasos, pantallazos, etc."
            value={descripcion}
            onChange={onChange}
            className={`${inputClass} min-h-[120px]`}
          />
        </div>
      </div>
    </div>
  );
}
