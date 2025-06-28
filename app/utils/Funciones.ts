export function formatFecha(fechaStr: string) {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function formatHora(fechaStr: string) {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}
export function calcularDuracion(fechaInicio: string, fechaFin: string) {
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    const diferencia = fin.getTime() - inicio.getTime()
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24))
    return dias
}
