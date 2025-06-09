import CreateDetalleError from "../models/DetalleError";
import CreateSolicitude from "../models/Solicitud";
import Users from "../models/User";
import StorageNavegador from "./StorageNavegador";

class Solicitud {
    static async crearSolicitud(formData: CreateSolicitude) {
        const idTokenString = StorageNavegador.getItemWithExpiry("user") as Users;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud${idTokenString?.token!=null ? "/logeado" : ""}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${idTokenString?.token}`
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`Error al crear el usuario: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }

    static async crearDetalleError(formData: CreateDetalleError) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-error`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        if (!response.ok) {
            throw new Error(`Error al crear el usuario: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    }
    static async actualizarEstado(payload: {
        idSolicitud: number;
        estado: 'Aprobado' | 'Rechazado';
        justificacion: string;
    }) {
        const idTokenString = StorageNavegador.getItemWithExpiry("user") as Users;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/registro-aprobacion`, {
            method: 'POST',
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