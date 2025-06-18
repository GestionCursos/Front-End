import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

export default function SolicitudCardPendiente({ solicitud, onAprobar, onRechazar }) {
  return (
    <Card className="border-2 border-yellow-200 rounded-2xl shadow-lg bg-white/80">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{solicitud.idUser.nombres} {solicitud.idUser.apellidos}</h3>
            <p className="text-xs text-gray-500">{solicitud.idUser.correo}</p>
          </div>
          <span className="capitalize px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 font-bold border border-yellow-300 shadow-sm">Pendiente</span>
        </div>
        <div className="border-t pt-3 space-y-2 text-sm text-gray-700">
          <p><span className="font-medium">Apartado:</span> {solicitud.apartado}</p>
          <p><span className="font-medium">Tipo:</span> {solicitud.tipoCambio}</p>
          <p><span className="font-medium">Urgencia:</span> {solicitud.urgencia}</p>
          <p><span className="font-medium">Justificación:</span> {solicitud.justificacion}</p>
          <a href={solicitud.archivo} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium hover:text-blue-800 transition">Ver archivo adjunto</a>
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t mt-3">
          <button onClick={onAprobar} className="inline-flex items-center gap-1 px-4 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition shadow-md hover:scale-105 active:scale-95">
            <CheckCircle size={16} /> Aprobar
          </button>
          <button onClick={onRechazar} className="inline-flex items-center gap-1 px-4 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition shadow-md hover:scale-105 active:scale-95">
            <XCircle size={16} /> Rechazar
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
