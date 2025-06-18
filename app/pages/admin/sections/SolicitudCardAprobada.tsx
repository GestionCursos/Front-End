import React, { useEffect, useState } from 'react';
import StorageNavegador from "@/app/Services/StorageNavegador";

export default function SolicitudCardAprobada({ solicitud, onChange }) {
  const [colaboradoresBackend, setColaboradoresBackend] = useState<any[]>([]);
  const [colaboradoresFrontend, setColaboradoresFrontend] = useState<any[]>([]);
  const [colaboradorBackend, setColaboradorBackend] = useState(solicitud.colaboradorGithubBackend || '');
  const [colaboradorFrontend, setColaboradorFrontend] = useState(solicitud.colaboradorGithubFrontend || '');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [implementaBackend, setImplementaBackend] = useState(false);
  const [implementaFrontend, setImplementaFrontend] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/colaboradores/backend`)
      .then(res => res.json())
      .then(data => setColaboradoresBackend(Array.isArray(data) ? data : []));
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/colaboradores/frontend`)
      .then(res => res.json())
      .then(data => setColaboradoresFrontend(Array.isArray(data) ? data : []));
  }, []);

  const confirmarAsignaciones = async () => {
    setLoading(true);
    setMensaje('');
    const idTokenString = StorageNavegador.getItemWithExpiry("user");
    const token = idTokenString?.token;
    try {
      if (implementaBackend && colaboradorBackend) {
        const resBackend = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/asignar-colaborador/${solicitud.idSolicitud}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ colaboradorGithub: colaboradorBackend, repo: 'backend' }),
        });
        if (!resBackend.ok) throw new Error('Error al asignar colaborador backend');
      }
      if (implementaFrontend && colaboradorFrontend) {
        const resFrontend = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/asignar-colaborador/${solicitud.idSolicitud}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ colaboradorGithub: colaboradorFrontend, repo: 'frontend' }),
        });
        if (!resFrontend.ok) throw new Error('Error al asignar colaborador frontend');
      }
      // Ahora sí, iniciar implementación (cambiar estado y crear ramas)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/iniciar-implementacion/${solicitud.idSolicitud}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (res.ok) {
        setMensaje('Implementación iniciada, ramas creadas.');
        onChange && onChange(solicitud.idSolicitud, 'Implementando');
      } else setMensaje('Error al iniciar implementación.');
    } catch (err) {
      if (err instanceof Error) {
        setMensaje(err.message);
      } else {
        setMensaje('Error en la asignación');
      }
    }
    setLoading(false);
  };

  const puedeConfirmar =
    ((implementaBackend && colaboradorBackend) || (implementaFrontend && colaboradorFrontend));

  return (
    <div className="border-2 rounded-2xl p-5 shadow-lg bg-white/90">
      <div className="font-semibold text-lg text-gray-800 flex items-center gap-2 mb-2">
        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-gray-500">#{solicitud.idSolicitud}</span>
        {solicitud.titulo || 'Solicitud'}
        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm bg-green-100 text-green-700 border border-green-300">Aprobado</span>
      </div>
      <div className="text-sm text-gray-600 mb-2">{solicitud.descripcion}</div>
      <div className="flex gap-6 mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={implementaBackend} onChange={e => setImplementaBackend(e.target.checked)} />
          Implementar en Backend
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={implementaFrontend} onChange={e => setImplementaFrontend(e.target.checked)} />
          Implementar en Frontend
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backend */}
        <div className="p-2 border rounded bg-gray-50">
          <div className="font-bold mb-1">Backend</div>
          <div className="mb-2">
            <label className="mr-2">Colaborador:</label>
            <select value={colaboradorBackend} onChange={e => setColaboradorBackend(e.target.value)} className="border rounded px-2 py-1" disabled={!implementaBackend}>
              <option value="">Seleccionar</option>
              {colaboradoresBackend.map(user => (
                <option key={user.login} value={user.login}>{user.login}</option>
              ))}
            </select>
          </div>
          <div className="text-xs text-gray-500">Rama: <span className="font-mono">{solicitud.ramaBackend || '-'}</span></div>
        </div>
        {/* Frontend */}
        <div className="p-2 border rounded bg-gray-50">
          <div className="font-bold mb-1">Frontend</div>
          <div className="mb-2">
            <label className="mr-2">Colaborador:</label>
            <select value={colaboradorFrontend} onChange={e => setColaboradorFrontend(e.target.value)} className="border rounded px-2 py-1" disabled={!implementaFrontend}>
              <option value="">Seleccionar</option>
              {colaboradoresFrontend.map(user => (
                <option key={user.login} value={user.login}>{user.login}</option>
              ))}
            </select>
          </div>
          <div className="text-xs text-gray-500">Rama: <span className="font-mono">{solicitud.ramaFrontend || '-'}</span></div>
        </div>
      </div>
      {/* Botón para confirmar asignaciones */}
      <div className="flex justify-center mt-4">
        <button onClick={confirmarAsignaciones} disabled={loading || !puedeConfirmar} className="px-4 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800 transition disabled:opacity-50">Confirmar asignaciones</button>
      </div>
      {mensaje && <div className="mt-2 text-sm text-blue-700 animate-pulse">{mensaje}</div>}
    </div>
  );
}
