export interface Colaborador {
    nombre: string;
    avatar: string;
    cambios: number;
    aprobacion: number;
    especialidad: string;
    tendencia: string;
}
export interface Cambio {
    id: string;
    titulo: string;
    desarrollador: string;
    tipo: string;
    estado: string;
    prioridad: string;
    fecha: string;
}

export interface EstadisticasEstados {
    estado: string, valor: number, color: string, porcentaje: number,
}
export interface DatosEvolucion {
    fecha: string, solicitudes: number, aprobadas: number, rechazadas: number, pendientes: number
}
export interface TipoCambio {
    tipo: string, cantidad: number, icono: string, color: string    
}
