import { SolicitudGeneral } from "./SolicitudGeneral";

export interface SolicitudConError {
  idDetalle: number;
  idSolicitud: SolicitudGeneral;
  pasosReproduccion: string;
  resultadoEsperado: string;
  resultadoObservado: string;
  fechaIncidente: string; // ISO string
  frecuenciaError: string;
  mensajeError: string;
  sistemaNavegador: string;
  urlError: string;
  workaround: string;
}
