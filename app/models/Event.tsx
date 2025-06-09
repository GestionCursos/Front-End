export interface Event {
  id_evento: number;
  nombre: string;
  tipoEvento: string;        // ✅ Cambio: tipo_evento → tipoEvento
  fechaInicio: Date | string; // ✅ Cambio: fecha_inicio → fechaInicio
  fechaFin: Date | string;    // ✅ Cambio: fecha_fin → fechaFin
  modalidad: string;
  costo: number;
  categoria: string;
  numeroHoras: number;        // ✅ Cambio: numero_horas → numeroHoras
  notaAprovacion: number;     // ✅ Cambio: nota_aprovacion → notaAprovacion
  requiereAsistencia: boolean; // ✅ Cambio: requiere_asistencia → requiereAsistencia
  urlFoto: string;            // ✅ Cambio: url_foto → urlFoto
  visible: boolean;
  descripcion: string;
  id_organizador: number;
  fechaEliminacion?: Date | string | null; // ✅ Cambio: fecha_eliminacion → fechaEliminacion
  id_seccion: number;
  requisitos:{idRequisito:number,nombre:string}[]
}

export default Event;