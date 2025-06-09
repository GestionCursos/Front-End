
export interface Asistencia {
    id_asistencia: number; // PK
    id_inscripcion: number; // FK → Inscripcion.id_inscripcion
    fecha_asistencia: Date;
    asistio: boolean;
}

export default Asistencia;
