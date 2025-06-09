import Users from "../models/User";
import StorageNavegador from "./StorageNavegador";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/contenido-home`;

export async function getContenidoHome() {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener el contenido de home');
  return res.json();
}

/**
 * metodo para actuializar mision y vision de la pagina
 */
export async function updateContenidoHome(id:number,conponente:{titulo:string,descripcion:string}) {
  const user = StorageNavegador.getItemWithExpiry("user") as Users;
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`,
    },
    body: JSON.stringify(conponente),
  });

  if (!res.ok) throw new Error('Error al actualizar contenido');
  return res.json();
}
