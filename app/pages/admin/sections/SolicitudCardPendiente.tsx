import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  solicitud: any;
  onAprobar?: () => void;
  onRechazar?: () => void;
  onSuccess?: (msg: string) => void;
}

export default function SolicitudCardPendiente({ solicitud, onAprobar, onRechazar, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const handleAprobar = async () => {
    setLoading(true);
    // Simula el proceso de aprobación y envío de correo
    try {
      // Aquí iría la llamada real a la API de aprobación y envío de correo
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulación async
      onAprobar && onAprobar();
    } finally {
      setLoading(false);
    }
  };

  const handleRechazar = async () => {
    setLoading(true);
    // Aquí iría la lógica real de rechazo y notificación
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación async
      onSuccess && onSuccess('Solicitud rechazada correctamente.');
      onRechazar && onRechazar();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl shadow-xl bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-200 p-4 transition-transform hover:scale-[1.02] hover:shadow-2xl duration-200 max-w-full overflow-hidden">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start mb-2">
          <div className="truncate max-w-[70%]">
            <h3 className="text-lg font-bold text-yellow-900 truncate">{solicitud.idUser.nombres} {solicitud.idUser.apellidos}</h3>
            <p className="text-xs text-gray-500 truncate">{solicitud.idUser.correo}</p>
          </div>
          <span className="capitalize px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 font-bold border border-yellow-300 shadow-sm">Pendiente</span>
        </div>
        <div className="border-t pt-3 space-y-2 text-sm text-gray-700 break-words">
          <p><span className="font-medium">Apartado:</span> {solicitud.apartado}</p>
          <p><span className="font-medium">Tipo:</span> {solicitud.tipoCambio}</p>
          <p><span className="font-medium">Urgencia:</span> {solicitud.urgencia}</p>
          <p><span className="font-medium">Justificación:</span> {solicitud.justificacion}</p>
          <a href={solicitud.archivo} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium hover:text-blue-800 transition break-all">Ver archivo adjunto</a>
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t mt-3">
          <button
            onClick={handleAprobar}
            disabled={loading}
            className={`inline-flex items-center gap-1 px-4 py-1.5 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 transition shadow-md hover:scale-105 active:scale-95 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <CheckCircle size={16} /> {loading ? 'Procesando...' : 'Aprobar'}
          </button>
          <button
            onClick={handleRechazar}
            disabled={loading}
            className={`inline-flex items-center gap-1 px-4 py-1.5 bg-red-600 text-white text-sm rounded-full hover:bg-red-700 transition shadow-md hover:scale-105 active:scale-95 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <XCircle size={16} /> Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}
