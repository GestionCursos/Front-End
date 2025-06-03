
class StorageNavegador {

    // Función para guardar en localStorage con expiración
    static saveToLocalStorageWithExpiry(key: string, value: any, ttlMs: number) {
        if (typeof window === "undefined" || !window.localStorage) return;
        const item = {
            data: value,
            expiry: Date.now() + ttlMs,
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    // Función para obtener el user guardado en el localStore
    static getItemWithExpiry<T>(key: string): T | null {
        if (typeof window === "undefined" || !window.localStorage) return null;
        const stored = localStorage.getItem(key);
        if (!stored) return null;

        try {
            const parsed = JSON.parse(stored);
            if (Date.now() > parsed.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return parsed.data as T;
        } catch {
            localStorage.removeItem(key);
            return null;
        }
    }


}
export default StorageNavegador;

export const CATEGORIAS = [
    "Software",
    "Medicina",
    "Educación",
    "Ingeniería",
    "Cultura",
    "Deportes",
];
