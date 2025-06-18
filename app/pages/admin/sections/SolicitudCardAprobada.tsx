import React, { useEffect, useState } from 'react';

export default function SolicitudCardAprobada({ solicitud, onChange }) {
  const [colaboradoresBackend, setColaboradoresBackend] = useState<any[]>([]);
  const [colaboradoresFrontend, setColaboradoresFrontend] = useState<any[]>([]);
  const [colaboradorBackend, setColaboradorBackend] = useState(solicitud.colaboradorGithubBackend || '');
  const [colaboradorFrontend, setColaboradorFrontend] = useState(solicitud.colaboradorGithubFrontend || '');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/colaboradores/backend`)
      .then(res => res.json())
      .then(data => setColaboradoresBackend(Array.isArray(data) ? data : []));
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/colaboradores/frontend`)
      .then(res => res.json())
      .then(data => setColaboradoresFrontend(Array.isArray(data) ? data : []));
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
    if (res.ok) {
      setMensaje(`Colaborador de ${repo} asignado y rama creada.`);
      onChange && onChange();
    } else setMensaje(`Error al asignar colaborador de ${repo}.`);
    setLoading(false);
  };

  const iniciarImplementacion = async () => {
    setLoading(true);
    setMensaje('');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/iniciar-implementacion/${solicitud.idSolicitud}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      setMensaje('Implementación iniciada, ramas creadas.');
      onChange && onChange();
    } else setMensaje('Error al iniciar implementación.');
    setLoading(false);
  };

  return (
    <div className="border-2 rounded-2xl p-5 shadow-lg bg-white/90">
      <div className="font-semibold text-lg text-gray-800 flex items-center gap-2 mb-2">
        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-gray-500">#{solicitud.idSolicitud}</span>
        {solicitud.titulo || 'Solicitud'}
        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm bg-green-100 text-green-700 border border-green-300">Aprobado</span>
      </div>
      <div className="text-sm text-gray-600 mb-2">{solicitud.descripcion}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backend */}
        <div className="p-2 border rounded bg-gray-50">
          <div className="font-bold mb-1">Backend</div>
          <div className="mb-2">
            <label className="mr-2">Colaborador:</label>
            <select value={colaboradorBackend} onChange={e => setColaboradorBackend(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Seleccionar</option>
              {colaboradoresBackend.map(user => (
                <option key={user.login} value={user.login}>{user.login}</option>
              ))}
            </select>
            <button onClick={() => asignarColaborador('backend')} disabled={loading || !colaboradorBackend} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">Asignar</button>
          </div>
          <div className="text-xs text-gray-500">Rama: <span className="font-mono">{solicitud.ramaBackend || '-'}</span></div>
        </div>
        {/* Frontend */}
        <div className="p-2 border rounded bg-gray-50">
          <div className="font-bold mb-1">Frontend</div>
          <div className="mb-2">
            <label className="mr-2">Colaborador:</label>
            <select value={colaboradorFrontend} onChange={e => setColaboradorFrontend(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Seleccionar</option>
              {colaboradoresFrontend.map(user => (
                <option key={user.login} value={user.login}>{user.login}</option>
              ))}
            </select>
            <button onClick={() => asignarColaborador('frontend')} disabled={loading || !colaboradorFrontend} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">Asignar</button>
          </div>
          <div className="text-xs text-gray-500">Rama: <span className="font-mono">{solicitud.ramaFrontend || '-'}</span></div>
        </div>
      </div>
      {/* Botón para iniciar implementación solo si ambos responsables están asignados */}
      {solicitud.colaboradorGithubBackend && solicitud.colaboradorGithubFrontend && (
        <div className="flex justify-center mt-4">
          <button onClick={iniciarImplementacion} disabled={loading} className="px-4 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800 transition">Iniciar implementación</button>
        </div>
      )}
      {mensaje && <div className="mt-2 text-sm text-blue-700 animate-pulse">{mensaje}</div>}
    </div>
  );
}
