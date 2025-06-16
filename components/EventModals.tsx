"use client";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

export function LoginRequiredModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <AlertCircle className="h-12 w-12 text-red-500 mb-4 mx-auto animate-bounce" />
          <DialogTitle className="text-2xl font-bold mb-2 text-primary text-center">No has iniciado sesión</DialogTitle>
          <DialogDescription className="mb-6 text-gray-700 text-center">
            Debes iniciar sesión para poder inscribirte en este evento.<br />
            Haz clic en "Ir a iniciar sesión" para acceder o en "Cancelar" para volver.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="w-1/2">Cancelar</Button>
          <Link href="/pages/login" className="w-1/2">
            <Button className="w-full" variant="default">Ir a iniciar sesión</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AdminNotAllowedModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <AlertCircle className="h-12 w-12 text-red-500 mb-4 mx-auto animate-bounce" />
          <DialogTitle className="text-2xl font-bold mb-2 text-primary text-center">Acción no permitida</DialogTitle>
          <DialogDescription className="mb-6 text-gray-700 text-center">
            Los administradores no pueden inscribirse a eventos.<br />
            Si necesitas participar, utiliza una cuenta de estudiante.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} variant="default" className="w-full">Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RegistrationSuccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <CheckCircle className="h-12 w-12 text-green-500 mb-4 mx-auto animate-bounce" />
          <DialogTitle className="text-2xl font-bold mb-2 text-primary text-center">¡Inscripción exitosa!</DialogTitle>
          <DialogDescription className="mb-6 text-gray-700 text-center">
            Te has inscrito correctamente en el evento.<br />
            Revisa tu correo o tu panel de usuario para más detalles.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} variant="default" className="w-full">Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RegistrationErrorModal({ open, onClose, errorMessage }: { open: boolean; onClose: () => void; errorMessage: string }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <AlertCircle className="h-12 w-12 text-red-500 mb-4 mx-auto animate-bounce" />
          <DialogTitle className="text-2xl font-bold mb-2 text-primary text-center">Error al inscribirse</DialogTitle>
          <DialogDescription className="mb-6 text-gray-700 text-center">
            {errorMessage}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} variant="default" className="w-full">Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
