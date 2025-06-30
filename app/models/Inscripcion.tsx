
export interface Inscripcion {
    id_inscripcion: number; 
    id_usuario: string;
    id_evento: number; 
    fecha_inscripcion: Date;
    estado_pago: string;
    forma_pago: string;
    comprobante_pago: string;
    estado_inscripcion: string;
}

// Interfaz para crear una nueva inscripción (coincide con el DTO del backend)
export interface CreateInscripcionDto {
    evento: number;
    urlComprobantePago?: string;
    urlCedulaPapeletaV?: string;
    cartaMotivacion?: string;
}

export default Inscripcion;
