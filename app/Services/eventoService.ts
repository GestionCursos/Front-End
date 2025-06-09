
import StorageNavegador from "./StorageNavegador";
import Users from "../models/User";
import { Evento } from "../models/CrearEvento";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/evento`;


/**
 * Crear evento
 */
export async function crearEvento(data: Evento) {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const res = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al obtener datos dashboard');
    const dat = res.json();
    return dat;
}

/**
 * metodo para aceptar o rechazar la solicitud de inscripcion de un estudiante 
 */
export async function actualizarEstadoInscripcion(id: number, data: { estado: string }) {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inscripcion/aprobar/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al obtener datos dashboard');
    const dat = res.json();
    return dat;
}

/**
 * metodo para calificar poner calificacion y asistencia al estudiante 
 */
export async function calificarEstudiante(data: { nota: number, asistencia: number, idInscripcion: number }) {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/asistencia`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al obtener datos dashboard');
    const dat = res.json();
    return dat;
}


/**
 * metodo para generar certificados de los estudiantes del evento 
 */
export async function generarCertificados(data: { idEvento: number}) {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/certificado`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al obtener datos dashboard');
    const dat = res.json();
    return dat;
}
/**
 * metodo para obtener los eventos populares 
 */
export async function obtenerEventosPopulares() {
    const res = await fetch(`${API_URL}/populares`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) throw new Error('Error al obtener datos dashboard');
    const dat = res.json();
    return dat;
}

