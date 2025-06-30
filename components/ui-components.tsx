import { AlertCircle, CheckCircle2 } from "lucide-react"

interface FormErrorProps {
  message?: string
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null

  return (
    <div className="flex items-center space-x-1 text-sm text-destructive mt-1">
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  )
}

interface FormSuccessProps {
  message?: string
}

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null

  return (
    <div className="flex items-center space-x-1 text-sm text-green-500 mt-1">
      <CheckCircle2 className="h-4 w-4" />
      <span>{message}</span>
    </div>
  )
}

export function PasswordStrengthIndicator({ password }: { password: string }) {
  if (!password) return null

  let strength = 0
  let color = "bg-red-500"
  let text = "Débil"

  // Incrementar la fuerza basada en diferentes criterios
  if (password.length >= 8) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[a-z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[^A-Za-z0-9]/.test(password)) strength += 1

  // Determinar color y texto basado en la fuerza
  if (strength === 5) {
    color = "bg-green-500"
    text = "Muy fuerte"
  } else if (strength >= 3) {
    color = "bg-yellow-500"
    text = "Moderada"
  } else if (strength >= 2) {
    color = "bg-orange-500"
    text = "Aceptable"
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground">Seguridad de la contraseña</span>
        <span className="text-xs font-medium">{text}</span>
      </div>
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300 ease-in-out`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}
