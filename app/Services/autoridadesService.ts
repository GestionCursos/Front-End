import Users from "../models/User";
import StorageNavegador from "./StorageNavegador";
import { Autoridad } from '@/app/models/Autoridad';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/autoridades`;

export async function getAutoridades() {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener autoridades');
  return res.json();
}

/**
 * Actualiza una autoridad existente.
 */
export async function updateAutoridades(id: number, autoridad: Partial<Autoridad>) {
  const user = StorageNavegador.getItemWithExpiry("user") as Users;
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`,
    },
    body: JSON.stringify(autoridad),
  });

  if (!res.ok) throw new Error('Error al actualizar autoridad');
  return res.json();
}



/**
 * Crea una nueva autoridad.
 */
export async function createAutoridades(autoridad: Partial<Autoridad>, orden: number) {
  const user = StorageNavegador.getItemWithExpiry("user") as Users;
  const res = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`,
    },
    body: JSON.stringify({
      ...autoridad,
      visible: true,
      orden: orden
    }),
  });

  if (!res.ok) throw new Error('Error al crear autoridad');
  return res.json();
}

/**
 * Eliminar Autoridad
 */
export async function deleteAutoridades(id: number) {
  const user = StorageNavegador.getItemWithExpiry("user") as Users;
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`,
    }
  });

  return res.json();
}