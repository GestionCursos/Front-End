const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/contenido-home`;

export async function getContenidoHome() {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener el contenido de home');
  return res.json();
}
