import { Seccion } from "../models/Sections";
import { Event } from "../models/Event";
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/secciones`;

// Obtener todas las secciones con sus eventos
export async function getSecciones(): Promise<Seccion[]> {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al obtener las secciones');
    return res.json();
  }

// Obtener todos los eventos de todas las secciones
export async function getTodosLosEventos(): Promise<Event[]> {
    const secciones = await getSecciones();
    return secciones.flatMap(seccion => seccion.eventos || []);
  }
  
// Obtener un evento específico por ID
export async function getEventoPorId(id: string): Promise<Event | null> {
    const eventos = await getTodosLosEventos();
    return eventos.find(evento => evento.id_evento.toString() === id) || null;
  }

// Obtener eventos de una sección específica
export async function getEventosPorSeccion(idSeccion: number): Promise<Event[]> {
    const secciones = await getSecciones();
    const seccion = secciones.find(s => s.id_seccion === idSeccion);
    return seccion?.eventos || [];
  }
