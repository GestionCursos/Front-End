'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, BadgeCheck } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface Data {
  url_foto: string
  nombre: string
  correo: string
  telefono: string
  evento: string
}

function CertificadoVerificador() {
  const searchParams = useSearchParams()
  const id_inscripcion = searchParams.get('id_inscripcion')

  const [mensaje, setMensaje] = useState<string | null>(null)
  const [dataEstudiante, setDataEstudiante] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id_inscripcion) {
      const obtenerData = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/certificado/comprobar/${id_inscripcion}`
          )
          const data = await res.json()
          setDataEstudiante(data)
          setMensaje('Certificado verificado correctamente')
        } catch (error) {
          setMensaje('No se pudo verificar el certificado.')
        } finally {
          setLoading(false)
        }
      }

      obtenerData()
    }
  }, [id_inscripcion])

  if (!id_inscripcion) {
    return (
      <Card className="p-8 text-center">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            ID no válido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No se proporcionó un ID de inscripción válido.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">
          Verificación de Certificado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center text-muted-foreground">Verificando...</div>
        ) : mensaje && dataEstudiante ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-primary/40 shadow-sm">
                <Image
                  src={dataEstudiante.url_foto || '/placeholder.jpg'}
                  alt="Foto del estudiante"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-lg font-semibold text-foreground">{dataEstudiante.nombre}</p>
              <p className="text-sm text-muted-foreground">{dataEstudiante.correo}</p>
              <p className="text-sm text-muted-foreground">{dataEstudiante.telefono}</p>
            </div>

            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md text-center shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2 font-semibold text-lg">
                <BadgeCheck className="w-5 h-5" />
                Certificado Válido
              </div>
              <p className="text-sm">
                Este certificado pertenece a{' '}
                <span className="font-medium text-foreground">{dataEstudiante.nombre}</span> y ha
                sido verificado exitosamente en nuestro sistema.
              </p>
              <p className="text-sm mt-2">
                <strong>Evento:</strong>{' '}
                <span className="text-foreground">{dataEstudiante.evento}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-600">{mensaje}</div>
        )}

        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Volver al inicio
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VerificarPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Suspense fallback={<div className="text-center text-muted-foreground">Cargando...</div>}>
        <CertificadoVerificador />
      </Suspense>
    </div>
  )
}