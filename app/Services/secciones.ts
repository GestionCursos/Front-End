import { Seccion } from "../models/Sections";
import User from "../models/User";
import StorageNavegador from "./StorageNavegador";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/secciones`;

export async function getSecciones(): Promise<Seccion[]> {
    const res = await fetch(baseUrl);
    const data = await res.json();
    return data.map((s: any) => ({
        id: s.id_seccion,
        nombre: s.nombre,
        descripcion: s.descripcion,
        icono_url: s.icono_url,
        orden: s.orden,
        visible: true, // adaptar si tienes esta propiedad
    }));
}

export async function createSeccion(seccion: Omit<Seccion, "id">): Promise<Seccion> {
    const user = StorageNavegador.getItemWithExpiry("user") as User;
    const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`,
    },
        body: JSON.stringify(seccion),
    });
    const s = await res.json();
    return {
        id_seccion: s.id_seccion,
        nombre: s.nombre,
        descripcion: s.descripcion,
        icono_url: s.icono_url,
        orden: s.orden,
        eventos: s.eventos ?? [], // Ensure eventos is always present
    };
}

export async function updateSeccion(id_seccion: number, data: Partial<Seccion>){
    const user = StorageNavegador.getItemWithExpiry("user") as User;
   const{id, ...rest}= data;
    const res = await fetch(`${baseUrl}/${id}`, {
        method: "PATCH",
       headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`,
    },
        body: JSON.stringify(rest),
    });
    const s = await res.json();
    
    
}

export async function deleteSeccion(id: number): Promise<void> {
    const user = StorageNavegador.getItemWithExpiry("user") as User;
    await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`,
    },
    });

}