import Users from "../models/User";
import StorageNavegador from "./StorageNavegador";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/organizador`;

export async function getOrganizadores() {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const res = await fetch(`${API_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
        },
    });

    if (!res.ok) throw new Error('Error al obtener organizadores');
    return res.json();
}

export async function crearOrganizador(organizador: any) {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const res = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(organizador)
    });

    if (!res.ok) throw new Error('Error al crear organizadores');
    return res.json();
}