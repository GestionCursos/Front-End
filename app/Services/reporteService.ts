import StorageNavegador from "./StorageNavegador";
import Users from "../models/User";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/reporte`;
export async function getEventos() {
    const user = StorageNavegador.getItemWithExpiry("user") as Users | null;
    const response = await fetch(`${API_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token ?? ''}`,
        },
    });
    const data = await response.json()
    return data;
}

export async function getDataReporteGeneral(id: number) {
    const user = StorageNavegador.getItemWithExpiry("user") as Users | null;
    const response = await fetch(`${API_URL}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token ?? ''}`,
        },
    });
    const data = await response.json()
    return data;
}
export async function getDataReporteOrganizador(id: number) {
    const user = StorageNavegador.getItemWithExpiry("user") as Users | null;
    const response = await fetch(`${API_URL}/organizador/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token ?? ''}`,
        },
    });
    const data = await response.json()
    return data;
}




