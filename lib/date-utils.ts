// Utility functions for consistent date formatting across SSR and client
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  let dateObj: Date;
  if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return "-";
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function formatDateTime(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  return `${start} - ${end}`
}

export function safeFormatDate(dateValue: any): string {
  if (!dateValue) return "-";
  let dateObj = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return "-";
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}
