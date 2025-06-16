// services/certificadoService.ts

import Certificado from "../models/Certificado";
import Users from "../models/User";
import StorageNavegador from "./StorageNavegador";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/certificado`;

export async function getCertificados() {
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
      throw new Error(error.message || 'Error obteniendo certificados');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getCertificadosByUsuario(uid_firebase: string) {
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error obteniendo certificados del usuario');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getCertificadoById(id: number) {
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
      throw new Error(error.message || 'Error obteniendo certificado');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function createCertificado(certificadoData: Partial<Certificado>) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(certificadoData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error creando certificado');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateCertificado(id: number, certificadoData: Partial<Certificado>) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(certificadoData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error actualizando certificado');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function deleteCertificado(id: number) {
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
      throw new Error(error.message || 'Error eliminando certificado');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function verifyCertificado(id: number) {
  try {
    const response = await fetch(`${API_URL}/${id}/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error verificando certificado');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function downloadCertificado(id: number) {
  try {
    const user = StorageNavegador.getItemWithExpiry("user") as Users;
    const token = user?.token;
    
    const response = await fetch(`${API_URL}/${id}/download`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error descargando certificado');
    }

    // Return the blob for download
    return await response.blob();
  } catch (error) {
    throw error;
  }
}
