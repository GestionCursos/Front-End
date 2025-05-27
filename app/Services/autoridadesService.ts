import StorageNavegador from "./StorageNavegador";
import { Autoridad } from '@/app/models/Autoridad';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/autoridades`;

export async function getAutoridades() {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener autoridades');
  return res.json();
}

export async function updateAutoridades(id: number, autoridad: Partial<Autoridad>) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(autoridad),
  });

  if (!res.ok) throw new Error('Error al actualizar autoridad');
  return res.json();
}


export async function createAutoridades(autoridad: Partial<Autoridad>) {
  const user = StorageNavegador.getItemWithExpiry("user") as { idToken: string } | null;
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.idToken ?? ''}`,
    },
    body: JSON.stringify(autoridad),
  });

  if (!res.ok) throw new Error('Error al crear autoridad');
  return res.json();
}