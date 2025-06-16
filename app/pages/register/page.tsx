"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormError, FormSuccess, PasswordStrengthIndicator } from "@/components/ui-components"
import { ImageUploadPro } from "@/components/image-upload-pro"
import { SiteLayout } from "@/components/site-layout"
import { registerSchema } from "@/lib/validations/auth"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { registerUsuario } from "../../Services/usuarioService"
import FirebaseService from "@/app/Services/firebase/FirebaseService"

import '@/app/globals.css'
import StorageNavegador from "@/app/Services/StorageNavegador"

import Users from "@/app/models/User"
import { getCarreras } from "@/app/Services/carreraService"


type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedCarrera, setSelectedCarrera] = useState("");

  // Estado para manejar la imagen de perfil
  const [file, setFile] = useState<File | null>(null);
  type Carrera = { id: string; nombre: string };
  const [carreras, setCarreras] = useState<Carrera[]>([]);


  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      telefono: "",
      direccion: "",
      password: "",
      confirmPassword: "",
      profileImage: undefined,
    },
  })

  const password = form.watch("password")
  const email = form.watch("email")
  const isUtaEmail = email.endsWith("@uta.edu.ec")

  const onSubmit = async (values: RegisterFormValues) => {

    setError("")
    setSuccess("")
    setIsPending(true)

    try {
      // Registrar usuario en Firebase y se almacenan sus credenciales en el localstorage
      await FirebaseService.registerWithEmailAndPassword(values.email, values.password, values.firstName,null)

      const user = StorageNavegador.getItemWithExpiry("user") as Users;
      // Subir imagen a Firebase Storage si existe
      let profileImageUrl = ""
      if (file && user?.uid) {
        const userUid = user?.uid ?? "";
        profileImageUrl = (await FirebaseService.uploadFile(file, userUid, "user.png")) ?? ""
      }

      const response = await registerUsuario({
        nombres: values.firstName,
        apellidos: values.lastName,
        correo: values.email,
        telefono: values.telefono,
        direccion: values.direccion,
        rol: "estudiante",
        carrera: selectedCarrera === "" ? null : selectedCarrera,
        estado: "activo",
        url_foto: profileImageUrl,
      })

      setSuccess("Tu cuenta ha sido creada correctamente")
      setTimeout(() => {
        router.push("/pages/login")
      })
    } catch (error: any) {
      setError(error.message || "Error al registrar el usuario")
    } finally {
      setIsPending(false)
    }
  }

  const handleImageChange = (file: File | null) => {
    setFile(file);
  }

  const getCarrerasHandler = async () => {
    setIsPending(true);
    try {
      const data = await getCarreras();
      setCarreras(data);
    } catch (error) {
      console.error('Error al obtener las carreras:', error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    getCarrerasHandler();
  }, []);
  return (
    <SiteLayout>
      <div className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="container px-4 mx-auto">
          <Card className="w-full max-w-md mx-auto auth-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-primary">Inscríbete en EduEvents</CardTitle>
              <CardDescription>Crea tu cuenta para acceder a eventos y cursos exclusivos</CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-center block">Foto de perfil</Label>
                  <ImageUploadPro
                    onChange={handleImageChange}
                    error={form.formState.errors.profileImage?.message?.toString()}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      placeholder="Juan"
                      className="auth-input"
                      disabled={isPending}
                      {...form.register("firstName")}
                    />
                    <FormError message={form.formState.errors.firstName?.message} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      placeholder="Pérez"
                      className="auth-input"
                      disabled={isPending}
                      {...form.register("lastName")}
                    />
                    <FormError message={form.formState.errors.lastName?.message} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="auth-input"
                    disabled={isPending}
                    {...form.register("email")}
                  />
                  <FormError message={form.formState.errors.email?.message} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      placeholder="0999999999"
                      className="auth-input"
                      disabled={isPending}
                      {...form.register("telefono")}
                    />
                    <FormError message={form.formState.errors.telefono?.message} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      placeholder="Av. Siempre Viva 123"
                      className="auth-input"
                      disabled={isPending}
                      {...form.register("direccion")}
                    />
                    <FormError message={form.formState.errors.direccion?.message} />
                  </div>
                </div>

                {isUtaEmail && (<div className="space-y-2">
                  <Label htmlFor="interestArea">Carrera a la que perteneces</Label>
                  <Select value={selectedCarrera} onValueChange={setSelectedCarrera} disabled={isPending}>
                    <SelectTrigger className="auth-input">
                      <SelectValue placeholder="Selecciona un área" />
                    </SelectTrigger>
                    <SelectContent>
                      {carreras.map((carrera) => (
                        <SelectItem key={carrera.id} value={carrera.nombre}>
                          {carrera.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="auth-input pr-10"
                      disabled={isPending}
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormError message={form.formState.errors.password?.message} />
                  <PasswordStrengthIndicator password={password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="auth-input pr-10"
                      disabled={isPending}
                      {...form.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormError message={form.formState.errors.confirmPassword?.message} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      id="terms"
                      type="checkbox"
                      {...form.register("terms")}
                      disabled={isPending}
                      className="accent-primary"
                    />
                    <Label htmlFor="terms" className="text-sm font-normal">
                      Acepto los{" "}
                      <Link href="/terms" className="text-primary hover:underline font-medium" target="_blank">
                        términos y condiciones
                      </Link>
                    </Label>
                  </div>
                  <FormError message={form.formState.errors.terms?.message} />
                </div>

                <FormError message={error} />
                <FormSuccess message={success} />
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full auth-button" type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Inscribirse"
                  )}
                </Button>
                <div className="text-center text-sm">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/pages/login" className="text-primary hover:underline font-medium">
                    Acceder
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </SiteLayout>
  )
}
