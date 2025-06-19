import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SolicitudCard from './SolicitudCard';
import { CheckCircle, XCircle } from 'lucide-react';

interface SectionSolicitudesProps {
  solicitudes: any[];
  emptyMsg: string;
  tipo: 'pendiente' | 'aprobada' | 'implementando' | 'finalizada';
  abrirModal?: (id: number, estado: "Aprobado" | "Rechazado") => void;
}

const SectionSolicitudes: React.FC<SectionSolicitudesProps> = ({ solicitudes, emptyMsg, tipo, abrirModal }) => {
  if (solicitudes.length === 0) return <div className="text-center text-gray-500 py-8">{emptyMsg}</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {solicitudes.map((sol) => (
        tipo === 'pendiente' ? (
          <Card key={sol.idSolicitud} className="border rounded-xl shadow-sm hover:shadow-md transition bg-white">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold">{sol.idUser.nombres} {sol.idUser.apellidos}</h3>
                  <p className="text-xs text-gray-500">{sol.idUser.correo}</p>
                </div>
                <span className="capitalize px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">{sol.estado}</span>
              </div>
              <div className="border-t pt-2 text-xs text-gray-700">
                <p><span className="font-medium">Apartado:</span> {sol.apartado}</p>
                <p><span className="font-medium">Tipo:</span> {sol.tipoCambio}</p>
                <p><span className="font-medium">Urgencia:</span> {sol.urgencia}</p>
                <p><span className="font-medium">Justificación:</span> {sol.justificacion}</p>
                <a href={sol.archivo} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Ver archivo adjunto</a>
              </div>
              <div className="flex flex-col gap-1 text-xs text-gray-700 mt-2">
                <div><span className="font-semibold">Backend:</span> <span className="ml-1">{sol.colaboradorGithubBackend || '-'}</span> <span className="ml-2 text-gray-500">Rama:</span> <span className="font-mono">{sol.ramaBackend || '-'}</span></div>
                <div><span className="font-semibold">Frontend:</span> <span className="ml-1">{sol.colaboradorGithubFrontend || '-'}</span> <span className="ml-2 text-gray-500">Rama:</span> <span className="font-mono">{sol.ramaFrontend || '-'}</span></div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                <button onClick={() => abrirModal && abrirModal(sol.idSolicitud, "Aprobado")}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition">
                  <CheckCircle size={14} /> Aprobar
                </button>
                <button onClick={() => abrirModal && abrirModal(sol.idSolicitud, "Rechazado")}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition">
                  <XCircle size={14} /> Rechazar
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <SolicitudCard key={sol.idSolicitud} solicitud={sol} />
        )
      ))}
    </div>
  );
};

export default SectionSolicitudes;
