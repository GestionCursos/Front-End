"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormError, FormSuccess } from "@/components/ui-components"
import { SiteLayout } from "@/components/site-layout"
import { loginSchema } from "@/lib/validations/auth"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import FirebaseService from "@/app/Services/firebase/FirebaseService"
import '../../globals.css'
import StorageNavegador from "@/app/Services/StorageNavegador"

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  setTimeout(() => {
    const user = StorageNavegador.getItemWithExpiry("user");
    if (user) {
      if (user && typeof user === "object" && "rol" in user && ((user as any).rol !== "admin" && (user as any).rol !== "admin2" && (user as any).rol !== "desarrollador")) {
        router.push("/pages/client/dashboard")
      } else {
        router.push("/pages/admin/dashboard")
      }
    }
  })

  const router = useRouter()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetMsg, setResetMsg] = useState<string | null>(null)
  const [resetError, setResetError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setError("")
    setSuccess("")
    setIsPending(true)

    try {
      // Autenticación real con FirebaseService
      const result = await FirebaseService.loginWithEmailAndPasword(values.email, values.password, "");
      if (result === true) {
        setError("Credenciales incorrectas o error de autenticación. Por favor, inténtalo de nuevo.")
        setIsPending(false)
        return;
      }
      setSuccess("Has iniciado sesión correctamente")
      setTimeout(() => {
        const user = StorageNavegador.getItemWithExpiry("user");
        if (user && typeof user === "object" && "rol" in user && (user as any).rol !== "admin") {
          router.push("/pages/dashboard")
        } else {
          router.push("/pages/admin")
        }
      })
    } catch (error) {
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <SiteLayout>
      {/* Modal de recuperación de contraseña */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-2">Recuperar contraseña</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Ingresa tu correo y recibirás instrucciones para restablecer tu contraseña.
            </p>
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="mb-2"
            />
            {resetMsg && (
              <div className="flex items-center justify-center gap-2 text-green-700 bg-green-100 border border-green-300 rounded px-3 py-2 mb-2 animate-fade-in">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span>{resetMsg}</span>
              </div>
            )}
            {resetError && (
              <div className="flex items-center justify-center gap-2 text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2 mb-2 animate-fade-in">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                <span>{resetError}</span>
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <Button
                onClick={async () => {
                  setResetMsg(null)
                  setResetError(null)
                  try {
                    await FirebaseService.resetPassword(resetEmail)
                    setResetMsg("¡Correo de recuperación enviado!")
                    setTimeout(() => {
                      setShowReset(false)
                      setResetMsg(null)
                      setResetError(null)
                    }, 1200)
                  } catch (err: any) {
                    setResetError("No se pudo enviar el correo. Verifica el email.")
                  }
                }}
                className="w-full"
                disabled={resetMsg !== null}
              >
                {resetMsg ? "Enviado" : "Enviar"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReset(false)
                  setResetMsg(null)
                  setResetError(null)
                }}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="container px-4 mx-auto">
          <Card className="w-full max-w-md mx-auto auth-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-primary">Acceder a tu cuenta</CardTitle>
              <CardDescription>Ingresa tus credenciales para acceder a tu perfil de EduEvents</CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline bg-transparent border-none p-0"
                      onClick={() => setShowReset(true)}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
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
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    {...form.register("rememberMe")}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Recordarme
                  </Label>
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full auth-button" type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Accediendo...
                    </>
                  ) : (
                    "Acceder"
                  )}
                </Button>
                <div className="text-center text-sm">
                  ¿No tienes una cuenta?{" "}
                  <Link href="/register" className="text-primary hover:underline font-medium">
                    Inscríbete
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
