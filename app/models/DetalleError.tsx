interface CreateDetalleError {
    idSolicitud: number;
    pasosReproduccion: string;
    resultadoEsperado: string;
    resultadoObservado: string;
    fechaIncidente: Date;
    frecuenciaError: string;
    mensajeError: string;
    sistemaNavegador: string;
    urlError: string;
    workaround: string;
}
export default CreateDetalleError