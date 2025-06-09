// services/usuarioService.ts

import Users from "../models/User";
import StorageNavegador from "./StorageNavegador";
import FirebaseService from "./firebase/FirebaseService";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/usuario`;

export async function registerUsuario(userData: any, token?: string) {
  try {
    if (!token) {
      const user = StorageNavegador.getItemWithExpiry("user") as Users;
      token = user?.token;
    }

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

export async function getUsuarios() {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error obteniendo usuarios');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getUsuarioByFirebaseUid(uid_firebase: string) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;

    const response = await fetch(`${API_URL}/firebase/${uid_firebase}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error obteniendo usuario');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateUsuario(uid_firebase: string, userData: Partial<Users>) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;

    const response = await fetch(`${API_URL}/${uid_firebase}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error actualizando usuario');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateUsuarioEstado(uid_firebase: string, estado: string) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;

    const response = await fetch(`${API_URL}/${uid_firebase}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ estado }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error actualizando estado del usuario');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function uploadUsuarioFoto(uid_firebase: string, fotoFile: File) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;

    const formData = new FormData();
    formData.append('foto', fotoFile);

    const response = await fetch(`${API_URL}/${uid_firebase}/foto`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error subiendo foto del usuario');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function deleteUsuario(uid_firebase: string) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;

    const response = await fetch(`${API_URL}/${uid_firebase}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error eliminando usuario');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getDashboardDataUsuario(uid_firebase: string) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;
    // El backend espera el UID como parámetro de consulta (query param) o en el token
    // Por la implementación actual, el backend obtiene el UID del token (req.userUid)
    // Así que NO es necesario enviar el UID en el header ni como query param
    // Solo envía el token correctamente
    const response = await fetch(`${API_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error obteniendo dashboard del usuario');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Cambia la contraseña del usuario autenticado en Firebase.
 * @param uid_firebase UID del usuario (no usado, para compatibilidad de interfaz)
 * @param currentPassword Contraseña actual
 * @param newPassword Nueva contraseña
 * @returns {Promise<boolean|{success: false, error: string}>}
 */
export async function updateUsuarioPassword(uid_firebase: string, currentPassword: string, newPassword: string) {
  // Solo se usa Firebase para cambiar la contraseña, el backend no almacena la contraseña
  return await FirebaseService.updatePassword(newPassword, currentPassword);
}

export async function obtenerListaUsuarios(id: number) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;
    const response = await fetch(`${API_URL}/evento/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
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
