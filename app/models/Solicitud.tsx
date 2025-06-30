interface CreateSolicitude {
    idUser: string;
    apartado: string;
    tipoCambio: string;
    otroTipo: string;
    descripcion: string;
    justificacion: string;
    urgencia: string;
    archivo: File | string;
}
export default CreateSolicitude
