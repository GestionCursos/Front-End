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

    if (!res.ok) throw new Error('Error al crear autoridad');
    return res.json();

}