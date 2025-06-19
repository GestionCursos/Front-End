import React, { useEffect, useState } from 'react';
import StorageNavegador from "@/app/Services/StorageNavegador";

interface Props {
  solicitud: any;
  onChange?: (id: number, nuevoEstado: string) => void;
  onSuccess?: (msg: string) => void;
}

export default function SolicitudCardAprobada({ solicitud, onChange, onSuccess }: Props) {
  const [colaboradoresBackend, setColaboradoresBackend] = useState<any[]>([]);
  const [colaboradoresFrontend, setColaboradoresFrontend] = useState<any[]>([]);
  const [colaboradorBackend, setColaboradorBackend] = useState(solicitud.colaboradorGithubBackend || '');
  const [colaboradorFrontend, setColaboradorFrontend] = useState(solicitud.colaboradorGithubFrontend || '');
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [implementaBackend, setImplementaBackend] = useState(false);
  const [implementaFrontend, setImplementaFrontend] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/colaboradores/backend`)
      .then(res => res.json())
      .then(data => setColaboradoresBackend(Array.isArray(data) ? data : []));
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/colaboradores/frontend`)
      .then(res => res.json())
      .then((data: any) => setColaboradoresFrontend(Array.isArray(data) ? data : []));
  }, []);

  const confirmarAsignaciones = async () => {
    setLoading(true);
    setModalMsg('');
    const idTokenString = StorageNavegador.getItemWithExpiry("user");
    const token = (idTokenString && typeof idTokenString === 'object' && 'token' in idTokenString) ? idTokenString.token : undefined;
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/iniciar-implementacion/${solicitud.idSolicitud}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (res.ok) {
        onSuccess && onSuccess('Implementación iniciada y ramas creadas correctamente.');
        return;
      } else {
        setModalMsg('Error al iniciar implementación.');
        setShowModal(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setModalMsg(err.message);
      } else {
        setModalMsg('Error en la asignación');
      }
      setShowModal(true);
    }
    setLoading(false);
  };

  const handleConfirmarAsignaciones = () => {
    setVerifyModal(true);
  };

  const handleConfirmarAsignacionesReal = async () => {
    setVerifyModal(false);
    await confirmarAsignaciones();
  };

  // Validación visual: mostrar advertencia si falta asignar colaborador
  const faltaColaborador =
    (implementaBackend && !colaboradorBackend) || (implementaFrontend && !colaboradorFrontend);

  // Solo permite confirmar si todos los checkboxes marcados tienen colaborador asignado
  const puedeConfirmar =
    ((implementaBackend ? !!colaboradorBackend : true) && (implementaFrontend ? !!colaboradorFrontend : true)) && (implementaBackend || implementaFrontend);

  return (
    <div className="rounded-3xl shadow-xl bg-gradient-to-br from-green-50 to-white border-2 border-green-200 p-6 transition-transform hover:scale-[1.02] hover:shadow-2xl duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="bg-green-100 text-green-700 font-mono text-xs px-3 py-1 rounded-full border border-green-300 shadow-sm">#{solicitud.idSolicitud}</span>
          <span className="font-bold text-lg text-green-900 drop-shadow-sm">{solicitud.titulo || 'Solicitud'}</span>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-200 text-green-800 border border-green-300 shadow">Aprobada</span>
      </div>
      <div className="text-base text-gray-700 mb-4 italic border-l-4 border-green-200 pl-4 bg-green-50/60 rounded-r-xl">{solicitud.descripcion}</div>
      <div className="flex gap-6 mb-4">
        <label className="flex items-center gap-2 text-green-800 font-medium">
          <input type="checkbox" checked={implementaBackend} onChange={e => setImplementaBackend(e.target.checked)} className="accent-green-600" />
          Implementar en Backend
        </label>
        <label className="flex items-center gap-2 text-green-800 font-medium">
          <input type="checkbox" checked={implementaFrontend} onChange={e => setImplementaFrontend(e.target.checked)} className="accent-green-600" />
          Implementar en Frontend
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Backend */}
        <div className="p-4 border rounded-2xl bg-white/80 shadow-sm flex flex-col gap-2">
          <div className="font-semibold text-green-700 flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full"></span>Backend</div>
          <div>
            <label className="mr-2 text-sm">Colaborador:</label>
            <select value={colaboradorBackend} onChange={e => setColaboradorBackend(e.target.value)} className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-200 max-w-full truncate" disabled={!implementaBackend} style={{maxWidth: '100%'}}>
              <option value="">Seleccionar</option>
              {colaboradoresBackend.map(user => (
                <option key={user.login} value={user.login} className="truncate max-w-full">{user.login}</option>
              ))}
            </select>
          </div>
          <div className="text-xs text-gray-500">Rama: <span className="font-mono">{solicitud.ramaBackend || '-'}</span></div>
        </div>
        {/* Frontend */}
        <div className="p-4 border rounded-2xl bg-white/80 shadow-sm flex flex-col gap-2">
          <div className="font-semibold text-green-700 flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full"></span>Frontend</div>
          <div>
            <label className="mr-2 text-sm">Colaborador:</label>
            <select value={colaboradorFrontend} onChange={e => setColaboradorFrontend(e.target.value)} className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-200 max-w-full truncate" disabled={!implementaFrontend} style={{maxWidth: '100%'}}>
              <option value="">Seleccionar</option>
              {colaboradoresFrontend.map(user => (
                <option key={user.login} value={user.login} className="truncate max-w-full">{user.login}</option>
              ))}
            </select>
          </div>
          <div className="text-xs text-gray-500">Rama: <span className="font-mono">{solicitud.ramaFrontend || '-'}</span></div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleConfirmarAsignaciones}
          disabled={loading || !puedeConfirmar}
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full shadow-lg font-semibold text-base hover:from-green-700 hover:to-green-600 transition disabled:opacity-50"
        >
          Confirmar asignaciones
        </button>
      </div>
      {verifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-xs w-full text-center">
            <h3 className="text-lg font-bold mb-2 text-blue-700">¿Confirmar asignaciones?</h3>
            <p className="mb-4 text-gray-700">¿Estás seguro de asignar estos colaboradores y crear las ramas?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={() => setVerifyModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={handleConfirmarAsignacionesReal} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Confirmar</button>
            </div>
          </div>
        </div>
      )}
      {faltaColaborador && (
        <div className="mt-2 text-center text-yellow-700 font-medium bg-yellow-100 rounded-xl py-2 shadow-inner border border-yellow-300">
          Debes seleccionar un colaborador para cada implementación marcada.
        </div>
      )}
      {modalMsg && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-xs w-full text-center">
            <h3 className="text-lg font-bold mb-2 text-red-700">Error</h3>
            <p className="mb-4 text-gray-700">{modalMsg}</p>
            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
