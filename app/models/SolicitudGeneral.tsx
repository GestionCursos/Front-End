interface Usuario {
    uid_firebase: string;
    nombres: string;
    apellidos: string;
    correo: string;
}
export interface SolicitudGeneral {
    idSolicitud: number;
    idUser: Usuario;
    apartado: string;
    tipoCambio: string;
    otroTipo: string;
    descripcion: string;
    justificacion: string;
    urgencia: "Baja" | "Media" | "Alta";
    archivo: string;
    estado: "Pendiente" | "Aprobado" | "Rechazado";
}
