import { Event } from './Event';

export interface Seccion {
    id_seccion: number;
    nombre: string;
    descripcion: string;
    icono_url: string;
    orden: number;
    eventos: Event[];
  }