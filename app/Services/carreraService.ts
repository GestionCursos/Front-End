const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/carreras`;

export async function getCarreras() {
    const carreras = await (await fetch(`${API_URL}`)).json()
    console.log(carreras);
    return carreras;
}


/**
 * metodo para obtener las secciones disponibles en el back junto con sus cursos
 */
export async function getSecciones() {
    const secciones = await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/secciones/data`)).json()
    return secciones;
}
/**
 * Metodo para obtener los requisitos disponibles para poner a un evento como cedula,carta de motivacion, etc
 */
export async function getRequisitos() {
    const secciones = await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/requisito`)).json()
    return secciones;
}

/**
 * Metodo para obtencion de las solicitudes de inscripcion de los estudiantes junto con sus recursos de inscripcion
 */
export async function getCalificaciones() {
    const secciones = await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/requisito-inscripcion/test-queries`)).json()
    return secciones;
}