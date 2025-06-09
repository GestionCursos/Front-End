// services/inscripcionService.ts

import Inscripcion from "../models/Inscripcion";
import Users from "../models/User";
import StorageNavegador from "./StorageNavegador";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/inscripcion`;

export async function getInscripciones() {
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
      throw new Error(error.message || 'Error obteniendo inscripciones');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/*export async function getInscripcionesByUsuario(uid_firebase: string) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;
    const response = await fetch(`${API_URL}/usuario/${uid_firebase}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    });
    if (response.status === 404) {
      // Si no hay inscripciones, devuelve array vacío en vez de error
      return [];
    }
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error obteniendo inscripciones del usuario');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}*/

export async function getInscripcionById(id: number) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error obteniendo inscripción');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function createInscripcion(inscripcionData: any) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(inscripcionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error creando inscripción');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateInscripcion(id: number, inscripcionData: Partial<Inscripcion>) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(inscripcionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error actualizando inscripción');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function deleteInscripcion(id: number) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error eliminando inscripción');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateEstadoPago(id: number, estado_pago: string, comprobante_pago?: string) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;
    
    const response = await fetch(`${API_URL}/${id}/pago`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ estado_pago, comprobante_pago }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error actualizando estado de pago');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
