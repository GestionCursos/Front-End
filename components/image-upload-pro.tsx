"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import NextImage from "next/image"
import { Button } from "@/components/ui/button"
import { Upload, X, Camera, RefreshCw } from "lucide-react"
import { FormError } from "@/components/ui-components"

interface ImageUploadProProps {
  onChange: (file: File | null) => void
  error?: string
}

export function ImageUploadPro({ onChange, error }: ImageUploadProProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validar el archivo seleccionado
  const validateFile = (file: File): boolean => {
    // Verificar el tipo de archivo
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      setFileError("El archivo debe ser una imagen (JPG, PNG, GIF o SVG)")
      return false
    }

    // Verificar el tamaño del archivo (2MB máximo)
    const maxSize = 2 * 1024 * 1024 // 2MB en bytes
    if (file.size > maxSize) {
      setFileError("La imagen no debe exceder los 2MB")
      return false
    }

    setFileError(null)
    return true
  }

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (file) {
        if (!validateFile(file)) {
          return
        }

        setIsLoading(true)
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
          setIsLoading(false)
        }
        reader.readAsDataURL(file)
        onChange(file)
      } else {
        setPreview(null)
        onChange(null)
      }
    },
    [onChange],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files[0])
      }
    },
    [handleFileChange],
  )

  const removeImage = useCallback(() => {
    setPreview(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [onChange])

  const rotateImage = useCallback(() => {
    if (!preview) return

    const image = new window.Image()
    image.src = preview
    image.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Intercambiar ancho y alto para rotar 90 grados
      canvas.width = image.height
      canvas.height = image.width

      // Rotar y dibujar la imagen
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((90 * Math.PI) / 180)
      ctx.drawImage(image, -image.width / 2, -image.height / 2)

      // Convertir a base64 y actualizar la vista previa
      const rotatedImage = canvas.toDataURL("image/jpeg")
      setPreview(rotatedImage)

      // Convertir base64 a File
      fetch(rotatedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "rotated-image.jpg", { type: "image/jpeg" })
          onChange(file)
        })
    }
  }, [preview, onChange])

  return (
    <div className="w-full">
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-200 ${
            isDragging
              ? "border-primary bg-primary/5"
              : fileError
                ? "border-destructive/50 bg-destructive/5"
                : "border-primary/30 hover:border-primary/50"
          } image-upload-container`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <p className="mb-2 text-base font-medium">
              <span className="text-primary">Haz clic para subir</span> o arrastra y suelta
            </p>
            <p className="text-sm text-muted-foreground mb-4">SVG, PNG, JPG o GIF (Máx. 2MB)</p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                type="button"
              >
                Seleccionar archivo
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Verificar si el navegador soporta getUserMedia
                  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices
                      .getUserMedia({ video: true })
                      .then((stream) => {
                        // Crear elementos temporales
                        const video = document.createElement("video")
                        const canvas = document.createElement("canvas")
                        const context = canvas.getContext("2d")

                        // Configurar video
                        video.srcObject = stream
                        video.play()

                        // Cuando el video esté listo, tomar la foto
                        video.onloadedmetadata = () => {
                          canvas.width = video.videoWidth
                          canvas.height = video.videoHeight
                          context?.drawImage(video, 0, 0, canvas.width, canvas.height)

                          // Detener la cámara
                          stream.getTracks().forEach((track) => track.stop())

                          // Convertir a base64 y luego a File
                          canvas.toBlob((blob) => {
                            if (blob) {
                              const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" })
                              handleFileChange(file)
                            }
                          }, "image/jpeg")
                        }
                      })
                      .catch((err) => {
                        setFileError("No se pudo acceder a la cámara: " + err.message)
                      })
                  } else {
                    setFileError("Tu navegador no soporta acceso a la cámara")
                  }
                }}
                className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                type="button"
              >
                <Camera className="h-4 w-4 mr-2" />
                Usar cámara
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/svg+xml"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                handleFileChange(file)
              }}
            />
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          <div className="relative aspect-square w-40 mx-auto overflow-hidden rounded-full border-4 border-primary/20 shadow-lg">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <NextImage src={preview || "/placeholder.svg"} alt="Vista previa" fill className="object-cover" />
            )}
          </div>
          <div className="absolute -top-2 -right-2 flex space-x-1">
            <button
              onClick={removeImage}
              className="bg-destructive text-destructive-foreground p-1.5 rounded-full shadow-md hover:bg-destructive/90 transition-colors"
              type="button"
              aria-label="Eliminar imagen"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={rotateImage}
              className="bg-primary text-primary-foreground p-1.5 rounded-full shadow-md hover:bg-primary/90 transition-colors"
              type="button"
              aria-label="Rotar imagen"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      {(fileError || error) && <FormError message={fileError || error} />}
    </div>
  )
}
