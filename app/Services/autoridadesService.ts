const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/autoridades`;

export async function getAutoridades() {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener autoridades');
  return res.json();
}