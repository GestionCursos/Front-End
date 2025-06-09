'use client';
import React from 'react';

interface Props {
  visible: boolean;
  detalleError: {
    pasosReproduccion: string;
    resultadoEsperado: string;
    resultadoObservado: string;
    fechaIncidente: Date;
    frecuenciaError: string;
    mensajeError: string;
    sistemaNavegador: string;
    urlError: string;
    workaround: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function DetalleError({ visible, detalleError, onChange }: Props) {
  if (!visible) return null;

  const inputClass =
    'w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="space-y-6 border-t pt-6">
      <h2 className="text-xl font-semibold text-primary dark:text-white">Detalles del Error</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pasos para reproducir el error
          </label>
          <textarea
            name="pasosReproduccion"
            value={detalleError.pasosReproduccion}
            onChange={onChange}
            className={`${inputClass} min-h-[100px]`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Resultado esperado
            </label>
            <input
              type="text"
              name="resultadoEsperado"
              value={detalleError.resultadoEsperado}
              onChange={onChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Resultado observado
            </label>
            <input
              type="text"
              name="resultadoObservado"
              value={detalleError.resultadoObservado}
              onChange={onChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha y hora del incidente
            </label>
            <input
              type="datetime-local"
              name="fechaIncidente"
              value={new Date(detalleError.fechaIncidente).toISOString().slice(0, 16)}
              onChange={onChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frecuencia del error
            </label>
            <select
              name="frecuenciaError"
              value={detalleError.frecuenciaError}
              onChange={onChange}
              className={inputClass}
            >
              <option value="">Seleccione</option>
              <option value="Siempre">Siempre</option>
              <option value="Intermitente">Intermitente</option>
              <option value="Unica vez">Única vez</option>
              <option value="No recurrente">No recurrente</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mensaje de error (si aparece)
          </label>
          <textarea
            name="mensajeError"
            value={detalleError.mensajeError}
            onChange={onChange}
            className={`${inputClass} min-h-[80px]`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sistema operativo / navegador
            </label>
            <input
              type="text"
              name="sistemaNavegador"
              value={detalleError.sistemaNavegador}
              onChange={onChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL o ruta donde ocurre
            </label>
            <input
              type="text"
              name="urlError"
              value={detalleError.urlError}
              onChange={onChange}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ¿Hay solución temporal o workaround?
          </label>
          <textarea
            name="workaround"
            value={detalleError.workaround}
            onChange={onChange}
            className={`${inputClass} min-h-[80px]`}
          />
        </div>
      </div>
    </div>
  );
}
