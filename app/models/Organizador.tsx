export interface CreateOrganizadorDTO {
    nombre: string;
    institucion: string;
    correo: string;
}

export interface Organizador {
    id: number | null;
    nombre: string;
    institucion: string;
    correo: string;
}
