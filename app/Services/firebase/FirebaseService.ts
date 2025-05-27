import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    getAuth,
    reauthenticateWithCredential,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    updatePassword,

} from "firebase/auth";
import StorageNavegador from "../StorageNavegador";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storageBucket } from "./FirebaseConfig";

class FirebaseService {

    static async loginWithEmailAndPasword(email: string, password: string, userName: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            const verifyE = await user.emailVerified;
            const rol = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuario/rol`, {
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            });
            const rolData = await rol.json();
            //agregar el obtener foto de usuario
            if (!verifyE) {
                alert("verifica tu correo Electronico")
                await sendEmailVerification(userCredential.user, { url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/login` });
            }

            StorageNavegador.saveToLocalStorageWithExpiry(
                "user", {
                uid: user.uid,
                email: email,
                verify: verifyE,
                token: idToken,
                username: rolData.username,
                urlUserImg: rolData.urlUserImg ? rolData.urlUserImg : await this.getImgUser(rolData.username),
                rol: rolData.rol,
            }, 60 * 60 * 1000
            );
        } catch (error) {
            console.error("Error de autenticación:", error);
            return true;
        }
    }

    static async registerWithEmailAndPassword(email: string, password: string, username: string) {
        try {
            const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            await sendEmailVerification(userCredential.user, { url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/login` });
            //agregar el obtener foto de usuario
            const verifyE = await user.emailVerified;
            if (!verifyE) {
                alert("verifica tu correo Electronico");
            }
            StorageNavegador.saveToLocalStorageWithExpiry(
                "user", {
                uid: user.uid,
                email: email,
                verify: verifyE,
                token: idToken,
                username: username,
                urlUserImg: null
            }, 60 * 60 * 1000);
        } catch (error) {
            console.error("Error de autenticación:", error);
            return true;
        }
    }

    /**
      * Sube un archivo al storage de Firebase bajo la carpeta del usuario.
      * Cada usuario tiene su propia carpeta dentro de /uploads/{username}/
      * 
      * @param file - Archivo a subir (por ejemplo: imagen, documento).
      * @param userName - Nombre del usuario (carpeta donde se sube).
      * @param fileName - Nombre del archivo (ej. 'user.png', 'documento.pdf').
      * @returns URL pública del archivo subido, o null si hubo error.
      */
    static async uploadFile(file: File, userName: string, fileName: string) {
        const storageRef = ref(storageBucket, `uploads/${userName}/${fileName}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL; // Devuelve la URL del archivo subido
        } catch (error) {
            console.error('Error al subir archivo:', error);
            return null;
        }
    }

    /**
    * Obtiene la URL de la imagen de perfil del usuario desde Firebase Storage.
    * Se asume que la imagen se guarda como 'user.png' dentro de la carpeta del usuario.
    * 
    * @param userName - Nombre del usuario (usado como identificador de carpeta).
    * @returns URL pública de la imagen, o null si no se pudo obtener.
    */
    private static async getImgUser(userName: string) {
        const referencia = ref(storageBucket, `uploads/${userName}/user.png`);
        try {
            const url = await getDownloadURL(referencia);
            return url;
        } catch (error) {
            console.error("Error al obtener la URL de la imagen:", error);
            return null;
        }
    }


    /**
     * Actualiza la contraseña del usuario autenticado.
     * 
     * Para poder actualizar la contraseña, Firebase requiere una reautenticación 
     * reciente del usuario. Esto se hace usando las credenciales actuales del usuario 
     * (correo y contraseña actual). Si la reautenticación es exitosa, se procede a 
     * actualizar la contraseña con el nuevo valor.
     * 
     * @param newPassword - Nueva contraseña que el usuario desea establecer.
     * @param currentPassword - Contraseña actual del usuario, necesaria para reautenticación.
     * @returns true si la operación fue exitosa, o undefined si hubo un error.
     */
    static async updatePassword(newPassword: string, currentPassword: string) {
        const auth = getAuth();
        const user = auth.currentUser;
        // Validar que haya un usuario autenticado
        if (!user) {
            console.error("No hay usuario autenticado");
            return;
        }
        const credential = EmailAuthProvider.credential(user.email!, currentPassword);

        try {
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            return true;

        } catch (error) {
            // Manejar errores comunes
            if ((error as { code: string }).code === 'auth/invalid-credential') {
                return { success: false, error: 'Invalid credentials' };
            } else {
                console.error("Error al actualizar la contraseña:", error);
            }
        }
    }


    /**
     * Envía un correo de restablecimiento de contraseña al usuario.
     * 
     * Esta función está pensada para ser utilizada en la vista de inicio de sesión,
     * en casos donde el usuario haya olvidado su contraseña. Firebase se encarga de enviar
     * un correo con un enlace para que el usuario pueda restablecerla de forma segura.
     * 
     * @param email Email del usuario a recuperar la cuenta
     */
    static async resetPassword(email: string) {
        await sendPasswordResetEmail(getAuth(), email);
    }
}

export default FirebaseService;
