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
      if (user && typeof user === "object" && "rol" in user && (user as any).rol !== "admin") {
        router.push("/pages/dashboard")
      } else {
        router.push("/pages/admin")
      }
    }
  })

  const router = useRouter()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
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
