import * as z from "zod"

// Esquema de validación para el inicio de sesión
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo electrónico es obligatorio" })
    .email({ message: "Ingresa un correo electrónico válido" }),
  password: z
    .string()
    .min(1, { message: "La contraseña es obligatoria" })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  rememberMe: z.boolean().optional(),
})

// Esquema de validación para el registro
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "El nombre es obligatorio" })
      .max(50, { message: "El nombre no puede exceder los 50 caracteres" }),
    lastName: z
      .string()
      .min(1, { message: "El apellido es obligatorio" })
      .max(50, { message: "El apellido no puede exceder los 50 caracteres" }),
    email: z
      .string()
      .min(1, { message: "El correo electrónico es obligatorio" })
      .email({ message: "Ingresa un correo electrónico válido" }),
    password: z
      .string()
      .min(1, { message: "La contraseña es obligatoria" })
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula" })
      .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula" })
      .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número" }),
    confirmPassword: z.string().min(1, { message: "Confirma tu contraseña" }),
    terms: z.literal(true, {
      errorMap: () => ({ message: "Debes aceptar los términos y condiciones" }),
    }),
    profileImage: z.any().optional(),
    telefono: z
      .string()
      .min(7, { message: "El teléfono es obligatorio y debe tener al menos 7 dígitos" })
      .max(20, { message: "El teléfono no puede exceder los 20 caracteres" }),
    direccion: z
      .string()
      .min(1, { message: "La dirección es obligatoria" })
      .max(100, { message: "La dirección no puede exceder los 100 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
