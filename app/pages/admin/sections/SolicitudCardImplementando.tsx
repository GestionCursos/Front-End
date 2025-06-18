import React, { useState } from 'react';
import StorageNavegador from "@/app/Services/StorageNavegador";

export default function SolicitudCardImplementando({ solicitud, onChange }) {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [prBackend, setPrBackend] = useState(false);
  const [prFrontend, setPrFrontend] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const marcarComoCompletado = async (repo: 'backend' | 'frontend') => {
    setLoading(true);
    setMensaje('');
    const idTokenString = StorageNavegador.getItemWithExpiry("user");
    const token = idTokenString?.token;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/completar/${solicitud.idSolicitud}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
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
    <div className="rounded-3xl shadow-xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 p-6 transition-transform hover:scale-[1.02] hover:shadow-2xl duration-200 max-w-full overflow-hidden">
      <div className="font-semibold text-lg text-blue-800 flex items-center gap-2 mb-2">
        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-gray-500">#{solicitud.idSolicitud}</span>
        <span className="truncate font-bold">{solicitud.titulo || 'Solicitud'}</span>
        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm bg-blue-100 text-blue-700 border border-blue-300">Implementando</span>
      </div>
      <div className="text-sm text-gray-600 mb-2 break-words">{solicitud.descripcion}</div>
      <div className="my-4 p-3 rounded-lg bg-blue-50 border border-blue-200 overflow-x-auto">
        <div className="font-bold text-blue-800 mb-1">Colaboradores y ramas asignadas:</div>
        <div className="flex flex-col gap-1 text-sm">
          <span><span className="font-semibold">Colaborador Backend:</span> {solicitud.colaboradorGithubBackend || '-'}</span>
          <span><span className="font-semibold">Rama Backend:</span> <span className="break-all">{solicitud.ramaBackend || '-'}</span></span>
          <span><span className="font-semibold">Colaborador Frontend:</span> {solicitud.colaboradorGithubFrontend || '-'}</span>
          <span><span className="font-semibold">Rama Frontend:</span> <span className="break-all">{solicitud.ramaFrontend || '-'}</span></span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-2">
        {solicitud.ramaBackend && (
          <label className="flex items-center gap-2 text-blue-800 font-medium">
            <input type="checkbox" checked={prBackend} onChange={e => setPrBackend(e.target.checked)} />
            PR Backend completado
          </label>
        )}
        {solicitud.ramaFrontend && (
          <label className="flex items-center gap-2 text-blue-800 font-medium">
            <input type="checkbox" checked={prFrontend} onChange={e => setPrFrontend(e.target.checked)} />
            PR Frontend completado
          </label>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-2 justify-center items-center mt-4">
        <button
          onClick={async () => {
            if (
              solicitud.ramaBackend && solicitud.ramaFrontend &&
              ((prBackend && !prFrontend) || (!prBackend && prFrontend))
            ) {
              setModalMsg('Debes completar ambos PR (Backend y Frontend) para finalizar la solicitud.');
              setShowModal(true);
              return;
            }
            if (solicitud.ramaBackend && prBackend) await marcarComoCompletado('backend');
            if (solicitud.ramaFrontend && prFrontend) await marcarComoCompletado('frontend');
          }}
          disabled={
            loading ||
            // Si hay ambas ramas, solo habilitar si ambos checkboxes están marcados
            (solicitud.ramaBackend && solicitud.ramaFrontend && (!prBackend || !prFrontend)) ||
            // Si solo hay backend, solo habilitar si prBackend está marcado
            (solicitud.ramaBackend && !solicitud.ramaFrontend && !prBackend) ||
            // Si solo hay frontend, solo habilitar si prFrontend está marcado
            (!solicitud.ramaBackend && solicitud.ramaFrontend && !prFrontend)
          }
          className="px-4 py-2 bg-green-600 text-white rounded-full shadow-lg font-semibold text-base hover:bg-green-700 transition disabled:opacity-50"
        >
          Confirmar PR Completados
        </button>
        <button onClick={marcarComoCancelado} disabled={loading} className="px-3 py-1 bg-red-600 text-white rounded-full disabled:opacity-50">Cancelar</button>
      </div>
      {/* Modal de advertencia */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-xs w-full text-center">
            <h3 className="text-lg font-bold mb-2 text-red-700">Atención</h3>
            <p className="mb-4 text-gray-700">{modalMsg}</p>
            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Cerrar</button>
          </div>
        </div>
      )}
      {mensaje && <div className="mt-2 text-sm text-blue-700 animate-pulse">{mensaje}</div>}
    </div>
  );
}
