import CreateDetalleError from "../models/DetalleError";
import CreateSolicitude from "../models/Solicitud";
import Users from "../models/User";
import StorageNavegador from "./StorageNavegador";

class Solicitud {
    static async crearSolicitud(formData: CreateSolicitude) {
        const idTokenString = StorageNavegador.getItemWithExpiry("user") as Users;
        // Permitir solicitudes sin usuario logueado
        const isLogged = !!idTokenString?.token;
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud${isLogged ? "/logeado" : ""}`;
        const headers: any = {
            'Content-Type': 'application/json',
        };
        if (isLogged) headers["Authorization"] = `Bearer ${idTokenString.token}`;
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`Error al crear el usuario: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }

    static async crearDetalleError(formData: CreateDetalleError) {
        const idTokenString = StorageNavegador.getItemWithExpiry("user") as Users;
        const headers: any = {
            'Content-Type': 'application/json',
        };
        if (idTokenString?.token) headers["Authorization"] = `Bearer ${idTokenString.token}`;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-error`, {
            method: 'POST',
            headers,
            body: JSON.stringify(formData)
        })
        if (!response.ok) {
            throw new Error(`Error al crear el usuario: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    }
    static async actualizarEstado(idSolicitud: number, payload: {
        estado?: 'Aprobado' | 'Rechazado' | string;
        descripcion?: string;
        tipoCambio?: string;
        otroTipo?: string;
        colaboradorGithub?: string;
        colaboradorGithubBackend?: string;
        colaboradorGithubFrontend?: string;
        ramaBackend?: string;
        ramaFrontend?: string;
    }) {
        const idTokenString = StorageNavegador.getItemWithExpiry("user") as Users;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/actualizar/${idSolicitud}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${idTokenString?.token}`
            },
            body: JSON.stringify(payload)
        })
        if (!response.ok) {
            throw new Error(`Error al actualizar el estado: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }


    static async obtenerReporteAprobaciones() {
        const idTokenString = StorageNavegador.getItemWithExpiry("user") as Users;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/registro-aprobacion`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${idTokenString?.token}`
                }
            });
            if (!response.ok) throw new Error('Error al obtener el reporte');
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    };


}
export default Solicitud;