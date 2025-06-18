import React from 'react';

export default function SolicitudCardFinalizada({ solicitud }) {
  return (
    <div className="border-2 rounded-2xl p-5 shadow-lg bg-white/90 opacity-80 grayscale border-gray-300">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-gray-500">#{solicitud.idSolicitud}</span>
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm
          ${solicitud.estado === 'Completado' ? 'bg-green-100 text-green-700 border border-green-300' :
            solicitud.estado === 'Cancelado' ? 'bg-red-100 text-red-700 border border-red-300' :
            'bg-gray-200 text-gray-700 border border-gray-300'}
        `}>
          {solicitud.estado}
        </span>
      </div>
      <div className="text-sm text-gray-600 mb-2">{solicitud.descripcion}</div>
      <div className="mt-4 p-4 rounded-lg bg-gray-100 border border-gray-200 text-center flex flex-col items-center gap-2">
        {solicitud.estado === 'Completado' && (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Solicitud completada y mergeada correctamente
          </span>
        )}
        {solicitud.estado === 'Cancelado' && (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            Solicitud cancelada por el administrador
          </span>
        )}
        {solicitud.estado === 'Rechazado' && (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            Solicitud rechazada
          </span>
        )}
        <div className="flex flex-col gap-1 text-sm mt-2 text-left w-full max-w-xs mx-auto">
          <span><span className="font-semibold">Colaborador Backend:</span> {solicitud.colaboradorGithubBackend || '-'}</span>
          <span><span className="font-semibold">Rama Backend:</span> {solicitud.ramaBackend || '-'}</span>
          <span><span className="font-semibold">Colaborador Frontend:</span> {solicitud.colaboradorGithubFrontend || '-'}</span>
          <span><span className="font-semibold">Rama Frontend:</span> {solicitud.ramaFrontend || '-'}</span>
        </div>
        {solicitud.justificacion && (
          <div className="mt-2 text-xs text-gray-500 italic text-left w-full max-w-xs mx-auto">Justificación: {solicitud.justificacion}</div>
        )}
      </div>
    </div>
  );
}
