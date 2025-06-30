import React, { useState } from 'react';
import CommitsModal from './CommitsModal';

export default function SolicitudCardFinalizada({ solicitud, onFilterChange }) {
  const [showCommitsModal, setShowCommitsModal] = useState(false);
  const [commits, setCommits] = useState<any[]>([]);
  const [commitsLoading, setCommitsLoading] = useState(false);
  const [commitsError, setCommitsError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const fetchCommits = async (repo: 'backend' | 'frontend', branch: string) => {
    setCommitsLoading(true);
    setCommitsError(null);
    setSelectedBranch(branch);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/commits/${repo}/${encodeURIComponent(branch)}`);
      if (!res.ok) throw new Error('No se pudieron obtener los commits');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCommits(data);
      setShowCommitsModal(true);
    } catch (e: any) {
      setCommitsError(e.message || 'Error desconocido');
      setShowCommitsModal(true);
    } finally {
      setCommitsLoading(false);
    }
  };

  return (
    <>
      <div className={`rounded-3xl shadow-xl bg-gradient-to-br p-6 max-w-full overflow-hidden
      ${solicitud.estado === 'Completado' ? 'from-green-50 to-white border-green-200 opacity-100 grayscale-0' : ''}
      ${solicitud.estado === 'Cancelado' ? 'from-red-50 to-white border-red-200 opacity-90 grayscale' : ''}
      ${solicitud.estado === 'Rechazado' ? 'from-gray-100 to-white border-gray-300 opacity-80 grayscale' : ''}
      border-2`}
    >
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
      <div className="text-sm text-gray-600 mb-2 break-words">{solicitud.descripcion}</div>
      <div className="mt-4 p-4 rounded-lg bg-gray-100 border border-gray-200 text-center flex flex-col items-center gap-2 overflow-x-auto">
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
          <span>
            <span className="font-semibold">Rama Backend:</span> <span className="break-all">{solicitud.ramaBackend || '-'}</span>
            {solicitud.ramaBackend && (
              <button className="ml-2 text-blue-600 underline hover:text-blue-800 text-xs" onClick={() => fetchCommits('backend', solicitud.ramaBackend)}>
                Ver commits
              </button>
            )}
          </span>
          <span><span className="font-semibold">Colaborador Frontend:</span> {solicitud.colaboradorGithubFrontend || '-'}</span>
          <span>
            <span className="font-semibold">Rama Frontend:</span> <span className="break-all">{solicitud.ramaFrontend || '-'}</span>
            {solicitud.ramaFrontend && (
              <button className="ml-2 text-blue-600 underline hover:text-blue-800 text-xs" onClick={() => fetchCommits('frontend', solicitud.ramaFrontend)}>
                Ver commits
              </button>
            )}
          </span>
        </div>
        {solicitud.justificacion && (
          <div className="mt-2 text-xs text-gray-500 italic text-left w-full max-w-xs mx-auto break-words">Justificación: {solicitud.justificacion}</div>
        )}
      </div>
    </div>
      <CommitsModal
        show={showCommitsModal}
        onClose={() => setShowCommitsModal(false)}
        branch={selectedBranch}
        commits={commits}
        loading={commitsLoading}
        error={commitsError}
      />
    </>
  );
}

// Filtro de estado (combobox)
export function FiltroEstadoFinalizadas({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-4 flex justify-end">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-200 max-w-xs"
      >
        <option value="">Todos los estados</option>
        <option value="Completado">Completado</option>
        <option value="Cancelado">Cancelado</option>
        <option value="Rechazado">Rechazado</option>
      </select>
    </div>
  );
}
