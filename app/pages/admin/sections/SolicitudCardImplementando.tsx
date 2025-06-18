import React, { useState } from 'react';

export default function SolicitudCardImplementando({ solicitud, onChange }) {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const marcarComoCompletado = async (repo: 'backend' | 'frontend') => {
    setLoading(true);
    setMensaje('');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/completar/${solicitud.idSolicitud}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo }),
    });
    if (res.ok) {
      setMensaje(`Solicitud completada y PR creado en ${repo}.`);
      onChange && onChange();
    } else setMensaje(`Error al completar solicitud en ${repo}.`);
    setLoading(false);
  };

  const marcarComoCancelado = async () => {
    setLoading(true);
    setMensaje('');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/cancelar/${solicitud.idSolicitud}`, {
      method: 'PATCH' });
    if (res.ok) {
      setMensaje('Solicitud cancelada.');
      onChange && onChange();
    } else setMensaje('Error al cancelar solicitud.');
    setLoading(false);
  };

  return (
    <div className="border-2 rounded-2xl p-5 shadow-lg bg-white/90 border-blue-300">
      <div className="font-semibold text-lg text-blue-800 flex items-center gap-2 mb-2">
        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-gray-500">#{solicitud.idSolicitud}</span>
        {solicitud.titulo || 'Solicitud'}
        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm bg-blue-100 text-blue-700 border border-blue-300">Implementando</span>
      </div>
      <div className="text-sm text-gray-600 mb-2">{solicitud.descripcion}</div>
      <div className="my-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
        <div className="font-bold text-blue-800 mb-1">Colaboradores y ramas asignadas:</div>
        <div className="flex flex-col gap-1 text-sm">
          <span><span className="font-semibold">Colaborador Backend:</span> {solicitud.colaboradorGithubBackend || '-'}</span>
          <span><span className="font-semibold">Rama Backend:</span> {solicitud.ramaBackend || '-'}</span>
          <span><span className="font-semibold">Colaborador Frontend:</span> {solicitud.colaboradorGithubFrontend || '-'}</span>
          <span><span className="font-semibold">Rama Frontend:</span> {solicitud.ramaFrontend || '-'}</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 justify-center items-center mt-2">
        <button onClick={() => marcarComoCompletado('backend')} disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50">Marcar como Completado (PR Backend)</button>
        <button onClick={() => marcarComoCompletado('frontend')} disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50">Marcar como Completado (PR Frontend)</button>
        <button onClick={marcarComoCancelado} disabled={loading} className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50">Cancelar Solicitud</button>
      </div>
      {mensaje && <div className="mt-2 text-sm text-blue-700 animate-pulse">{mensaje}</div>}
    </div>
  );
}
