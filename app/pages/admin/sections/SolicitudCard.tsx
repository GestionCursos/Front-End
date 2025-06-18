import React, { useEffect, useState } from 'react';

interface SolicitudCardProps {
  solicitud: any;
}

const SolicitudCard: React.FC<SolicitudCardProps> = ({ solicitud }) => {
  const [colaboradoresBackend, setColaboradoresBackend] = useState<any[]>([]);
  const [colaboradoresFrontend, setColaboradoresFrontend] = useState<any[]>([]);
  const [colaboradorBackend, setColaboradorBackend] = useState(solicitud.colaboradorGithubBackend || '');
  const [colaboradorFrontend, setColaboradorFrontend] = useState(solicitud.colaboradorGithubFrontend || '');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/colaboradores/backend`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setColaboradoresBackend(data);
        else setColaboradoresBackend([]);
      });
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/colaboradores/frontend`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setColaboradoresFrontend(data);
        else setColaboradoresFrontend([]);
      });
  }, []);

  const asignarColaborador = async (repo: 'backend' | 'frontend') => {
    setLoading(true);
    setMensaje('');
    const colaborador = repo === 'backend' ? colaboradorBackend : colaboradorFrontend;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/asignar-colaborador/${solicitud.idSolicitud}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colaboradorGithub: colaborador, repo }),
    });
    if (res.ok) setMensaje(`Colaborador de ${repo} asignado y rama creada.`);
    else setMensaje(`Error al asignar colaborador de ${repo}.`);
    setLoading(false);
  };

  // Nuevo: iniciar implementación
  const iniciarImplementacion = async () => {
    setLoading(true);
    setMensaje('');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/iniciar-implementacion/${solicitud.idSolicitud}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) setMensaje('Implementación iniciada, ramas creadas.');
    else setMensaje('Error al iniciar implementación.');
    setLoading(false);
  };

  const marcarComoCompletado = async (repo: 'backend' | 'frontend') => {
    setLoading(true);
    setMensaje('');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/completar/${solicitud.idSolicitud}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo }),
    });
    if (res.ok) setMensaje(`Solicitud completada y PR creado en ${repo}.`);
    else setMensaje(`Error al completar solicitud en ${repo}.`);
    setLoading(false);
  };

  const marcarComoCancelado = async () => {
    setLoading(true);
    setMensaje('');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/cancelar/${solicitud.idSolicitud}`, {
      method: 'PATCH' });
    if (res.ok) setMensaje('Solicitud cancelada.');
    else setMensaje('Error al cancelar solicitud.');
    setLoading(false);
  };

  return (
    <div className="border rounded p-4 bg-white shadow">
      <div className="font-semibold">{solicitud.titulo || 'Solicitud'} #{solicitud.idSolicitud}</div>
      <div className="text-sm text-gray-600 mb-2">{solicitud.descripcion}</div>
      <div className="mb-2">Estado: <span className="font-bold">{solicitud.estado}</span></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backend */}
        <div className="p-2 border rounded">
          <div className="font-bold mb-1">Backend</div>
          <div className="mb-2">
            <label className="mr-2">Colaborador:</label>
            <select value={colaboradorBackend} onChange={e => setColaboradorBackend(e.target.value)} className="border rounded px-2 py-1" disabled={solicitud.estado !== 'Aprobado'}>
              <option value="">Seleccionar</option>
              {colaboradoresBackend.map(user => (
                <option key={user.login} value={user.login}>{user.login}</option>
              ))}
            </select>
            <button onClick={() => asignarColaborador('backend')} disabled={loading || !colaboradorBackend || solicitud.estado !== 'Aprobado'} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">Asignar</button>
          </div>
          <div className="text-xs text-gray-500">Rama: <span className="font-mono">{solicitud.ramaBackend || '-'}</span></div>
        </div>
        {/* Frontend */}
        <div className="p-2 border rounded">
          <div className="font-bold mb-1">Frontend</div>
          <div className="mb-2">
            <label className="mr-2">Colaborador:</label>
            <select value={colaboradorFrontend} onChange={e => setColaboradorFrontend(e.target.value)} className="border rounded px-2 py-1" disabled={solicitud.estado !== 'Aprobado'}>
              <option value="">Seleccionar</option>
              {colaboradoresFrontend.map(user => (
                <option key={user.login} value={user.login}>{user.login}</option>
              ))}
            </select>
            <button onClick={() => asignarColaborador('frontend')} disabled={loading || !colaboradorFrontend || solicitud.estado !== 'Aprobado'} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">Asignar</button>
          </div>
          <div className="text-xs text-gray-500">Rama: <span className="font-mono">{solicitud.ramaFrontend || '-'}</span></div>
        </div>
      </div>
      {/* Botón para iniciar implementación solo si ambos responsables están asignados y estado es Aprobado */}
      {solicitud.estado === 'Aprobado' && solicitud.colaboradorGithubBackend && solicitud.colaboradorGithubFrontend && (
        <div className="flex justify-center mt-4">
          <button onClick={iniciarImplementacion} disabled={loading} className="px-4 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800 transition">Iniciar implementación</button>
        </div>
      )}
      {/* Visualización destacada en estado Implementando */}
      {solicitud.estado === 'Implementando' && (
        <div className="my-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex-1">
              <div className="font-bold text-blue-800 mb-1">Colaboradores y ramas asignadas:</div>
              <div className="flex flex-col gap-1 text-sm">
                <span className="inline-flex items-center gap-2"><span className="font-semibold">Backend:</span> <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded">{solicitud.colaboradorGithubBackend || '-'}</span> <span className="ml-2 text-gray-500">Rama:</span> <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-mono">{solicitud.ramaBackend || '-'}</span></span>
                <span className="inline-flex items-center gap-2"><span className="font-semibold">Frontend:</span> <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded">{solicitud.colaboradorGithubFrontend || '-'}</span> <span className="ml-2 text-gray-500">Rama:</span> <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-mono">{solicitud.ramaFrontend || '-'}</span></span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4 md:mt-0">
              <button onClick={() => marcarComoCompletado('backend')} disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50">Marcar como Completado (PR Backend)</button>
              <button onClick={() => marcarComoCompletado('frontend')} disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50">Marcar como Completado (PR Frontend)</button>
              <button onClick={marcarComoCancelado} disabled={loading} className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50">Cancelar Solicitud</button>
            </div>
          </div>
        </div>
      )}
      {mensaje && <div className="mt-2 text-sm text-blue-700">{mensaje}</div>}
    </div>
  );
};

export default SolicitudCard;
