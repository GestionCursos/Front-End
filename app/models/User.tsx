
interface User {
    uid_firebase: string; 
    nombres: string;
    apellidos: string;
    correo: string;
    cedula: string;
    telefono: string;
    direccion: string;
    rol: string;
    carrera: string;
    estado: string;
    url_foto: string;
    
    uid?: string;
    email?: string;
    verify?: boolean;
    token: string;
    username?: string;
    urlUserImg?: string;
}

export default User;