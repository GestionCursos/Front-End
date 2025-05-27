// services/usuarioService.ts

import Users from "../models/User";
import StorageNavegador from "./StorageNavegador";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/usuario`;

export async function registerUsuario(userData: any) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token=user?.token;
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error registrando usuario');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
