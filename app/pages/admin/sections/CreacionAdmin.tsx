"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/app/hooks/use-toast"
import {
  Users,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { deleteUsuario, registerUsuario } from "@/app/Services/usuarioService"
import FirebaseService from "@/app/Services/firebase/FirebaseService"
import { UserListCard } from "@/components/UserListCard"
import { FormularioCrearUsuario } from "@/components/FormularioCrearUsuario"

// Tipos
interface Usuario {
  uid_firebase: string
  nombres: string
  apellidos: string
  correo: string
  telefono?: string
  rol: string
  estado: "Activo" | "Inactivo"
  fechaCreacion: string
  ultimoAcceso?: string
}

interface FormularioUsuario {
  nombres: string
  apellidos: string
  correo: string
  telefono: string
  contraseña: string
  confirmarContraseña: string
  rol: string
}

// Servicio para usuarios
class UsuarioService {
  private static getAuthHeaders(): HeadersInit {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null
    let token = ""

    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        token = user.token || ""
      } catch (error) {
        console.error("Error parsing user from storage:", error)
      }
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  static async crearUsuario(usuario: Omit<FormularioUsuario, "confirmarContraseña">): Promise<boolean> {
    const token = await FirebaseService.registerWithEmailAndPassword(usuario.correo, usuario.contraseña, usuario.nombres, true);
    const { contraseña, ...data } = usuario
    const useaAlmacenar = {
      ...data,
      url_foto: " ",
      estado: "activo",
      direccion: " "
    }
    if (!token) {
      throw new Error("No se pudo registrar al usuario. Por favor, intente nuevamente.");
    }
    const response = await registerUsuario(useaAlmacenar, token);
    if (!response.ok) {
      return true;
    }
    return false;
  }

  static async obtenerUsuarios(): Promise<{ usersAdmin: Usuario[], usersDesarrolladores: Usuario[] }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/usuarrios-admin`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Error al obtener usuarios")
      }
      console.log("Response:", response)
      return response.json()
    } catch (error) {
      console.error("Error al obtener usuarios:", error)
      throw new Error("No se pudieron cargar los usuarios")
    }
  }

  static async eliminarUsuario(id: string): Promise<boolean> {
    try {
      const response = await deleteUsuario(id);
      if (!response.ok) {
        throw new Error("Error al eliminar usuario")
      }

      return true
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
      throw new Error("No se pudo eliminar el usuario")
    }
  }

}

export default function CrearUsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [desarrollador, setDesarrollador] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mostrarContraseña, setMostrarContraseña] = useState(false)
  const [mostrarConfirmarContraseña, setMostrarConfirmarContraseña] = useState(false)
  const [modalEliminar, setModalEliminar] = useState<{ visible: boolean; usuario: Usuario | null }>({
    visible: false,
    usuario: null,
  })
  const { toast } = useToast()

  const [formulario, setFormulario] = useState<FormularioUsuario>({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    contraseña: "",
    confirmarContraseña: "",
    rol: "admin2",
  })

  const [erroresValidacion, setErroresValidacion] = useState<Partial<FormularioUsuario>>({})

  const cargarUsuarios = async () => {
    try {
      setLoading(true)
      setError(null)
      const usuariosData = await UsuarioService.obtenerUsuarios()
      setUsuarios(usuariosData.usersAdmin)
      setDesarrollador(usuariosData.usersDesarrolladores)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Error al cargar usuarios",
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const validarFormulario = (): boolean => {
    const errores: Partial<FormularioUsuario> = {}

    if (!formulario.nombres.trim()) errores.nombres = "Los nombres son requeridos"
    if (!formulario.apellidos.trim()) errores.apellidos = "Los apellidos son requeridos"
    if (!formulario.correo.trim()) {
      errores.correo = "El correo es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.correo)) {
      errores.correo = "El correo no tiene un formato válido"
    }
    if (!formulario.contraseña) {
      errores.contraseña = "La contraseña es requerida"
    } else if (formulario.contraseña.length < 8) {
      errores.contraseña = "La contraseña debe tener al menos 8 caracteres"
    }
    if (formulario.contraseña !== formulario.confirmarContraseña) {
      errores.confirmarContraseña = "Las contraseñas no coinciden"
    }
    if (!formulario.rol) errores.rol = "El rol es requerido"

    setErroresValidacion(errores)
    return Object.keys(errores).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      toast({
        variant: "destructive",
        title: "Errores en el formulario",
        description: "Por favor corrige los errores antes de continuar",
      })
      return
    }

    setSubmitting(true)

    try {
      const { confirmarContraseña, ...usuarioData } = formulario
      await UsuarioService.crearUsuario(usuarioData)

      toast({
        title: "Usuario creado exitosamente",
        description: `El usuario ${formulario.nombres} ${formulario.apellidos} ha sido creado correctamente`,
      })

      // Limpiar formulario
      setFormulario({
        nombres: "",
        apellidos: "",
        correo: "",
        telefono: "",
        contraseña: "",
        confirmarContraseña: "",
        rol: "Administrador",
      })
      setErroresValidacion({})

      // Recargar usuarios
      await cargarUsuarios()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      toast({
        variant: "destructive",
        title: "Error al crear usuario",
        description: errorMessage,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEliminarUsuario = async () => {
    if (!modalEliminar.usuario) return

    try {
      await UsuarioService.eliminarUsuario(modalEliminar.usuario.uid_firebase)
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente",
      })
      setModalEliminar({ visible: false, usuario: null })
      await cargarUsuarios()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      toast({
        variant: "destructive",
        title: "Error al eliminar usuario",
        description: errorMessage,
      })
    }
  }


  const handleInputChange = (field: keyof FormularioUsuario, value: string) => {
    setFormulario((prev) => ({ ...prev, [field]: value }))
    // Limpiar error de validación cuando el usuario empiece a escribir
    if (erroresValidacion[field]) {
      setErroresValidacion((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios Administradores</h1>
            <p className="text-muted-foreground mt-2">Crea y administra usuarios con permisos de administrador</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={cargarUsuarios} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{usuarios.length} usuarios</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Formulario de creación */}
          <FormularioCrearUsuario
            formulario={formulario}
            erroresValidacion={erroresValidacion}
            mostrarContraseña={mostrarContraseña}
            mostrarConfirmarContraseña={mostrarConfirmarContraseña}
            submitting={submitting}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            setMostrarContraseña={setMostrarContraseña}
            setMostrarConfirmarContraseña={setMostrarConfirmarContraseña}
          />

          <div className="lg:col-span-2 space-y-8">

            {/* Lista de usuarios Admin*/}
            <UserListCard
              titulo="Usuarios Administradores"
              usuarios={usuarios}
              error={error}
              loading={loading}
              onRetry={cargarUsuarios}
              onDelete={(usuario) => setModalEliminar({ visible: true, usuario })}
            />

            <UserListCard
              titulo="Usuarios Desarrolladores"
              usuarios={desarrollador}
              error={error}
              loading={loading}
              onRetry={cargarUsuarios}
              onDelete={(usuario) => setModalEliminar({ visible: true, usuario })}
            />

          </div>
        </div>

        {/* Modal de confirmación para eliminar */}
        <Dialog
          open={modalEliminar.visible}
          onOpenChange={(open) => setModalEliminar({ visible: open, usuario: null })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar al usuario{" "}
                <strong>
                  {modalEliminar.usuario?.nombres} {modalEliminar.usuario?.apellidos}
                </strong>
                ? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalEliminar({ visible: false, usuario: null })}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleEliminarUsuario}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
