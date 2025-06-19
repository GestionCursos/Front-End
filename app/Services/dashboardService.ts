import StorageNavegador from "./StorageNavegador";
import Users from "../models/User";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard`;


const user = StorageNavegador.getItemWithExpiry("user") as Users;

function getAuthHeader() {
  if (!user || !user.token) {
    throw new Error('Usuario no autenticado. Inicie sesión para continuar.');
  }
  return { 'Authorization': `Bearer ${user.token}` };
}

export async function getDataDashboard() {
  const res = await fetch(`${API_URL}/datos`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  if (!res.ok) throw new Error('Error al obtener datos dashboard');
  return res.json();
}

export async function getSolicitudesGenerales() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/solicitudesGenerales`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  if (!res.ok) throw new Error('Error al obtener datos dashboard');
  return res.json();
}

export async function getSolicitudesError() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-error`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  if (!res.ok) throw new Error('Error al obtener datos dashboard');
  return res.json();
}