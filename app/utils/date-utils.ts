import { parse, isAfter, subDays, format } from "date-fns"
import { es } from "date-fns/locale"

export function filterDataByPeriod<T extends { fecha: string }>(data: T[], period: string): T[] {
    const days = Number.parseInt(period.replace("d", ""))
    const today = new Date()
    const cutoffDate = subDays(today, days)

    return data.filter((item) => {
        try {
            let parsedDate: Date
            // Formato "dd MMM" (ej: "01 Jun")
            if (item.fecha.match(/^\d{1,2}\s+\w{3}$/)) {
                parsedDate = parse(`${item.fecha} ${today.getFullYear()}`, "dd MMM yyyy", new Date(), { locale: es })
            }
            // Formato ISO (ej: "2024-06-01")
            else if (item.fecha.match(/^\d{4}-\d{2}-\d{2}/)) {
                parsedDate = new Date(item.fecha)
            }
            // Formato "dd/MM/yyyy"
            else if (item.fecha.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
                parsedDate = parse(item.fecha, "dd/MM/yyyy", new Date())
            }
            else {
                parsedDate = new Date(item.fecha)
            }

            // Verificar si la fecha es válida
            if (isNaN(parsedDate.getTime())) {
                console.warn(`Fecha inválida: ${item.fecha}`)
                return false
            }

            return isAfter(parsedDate, cutoffDate)
        } catch (error) {
            console.warn(`Error parsing date: ${item.fecha}`, error)
            return false
        }
    })
}

export function formatDateForDisplay(dateString: string): string {
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
            return dateString // Retornar original si no se puede parsear
        }
        return format(date, "dd MMM", { locale: es })
    } catch {
        return dateString
    }
}
