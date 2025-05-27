import CreateDetalleError from "../models/DetalleError";
import CreateSolicitude from "../models/Solicitud";
import Users from "../models/User";
import StorageNavegador from "./StorageNavegador";

class Solicitud {
    static async crearSolicitud(formData: CreateSolicitude) {
        const idTokenString = StorageNavegador.getItemWithExpiry("user") as Users;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitudes`, {
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
        console.log(data);
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
    static async actualizarEstado(estado: string, id: number, descripcion: string) {
        const idTokenString = StorageNavegador.getItemWithExpiry("user") as Users;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitud/actualizar/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${idTokenString?.token}`
            },
            body: JSON.stringify({
                estado: estado,
                descripcion: descripcion
            })
        })
        if (!response.ok) {
            throw new Error(`Error al crear el usuario: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    }
}
export default Solicitud;