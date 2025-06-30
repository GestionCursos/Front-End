import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareSuccessModalProps {
  open: boolean
  onClose: () => void
  success: boolean
}

export function ShareSuccessModal({ open, onClose, success }: ShareSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          {success ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mb-4 mx-auto animate-bounce" />
              <DialogTitle className="text-2xl font-bold mb-2 text-green-700 text-center">¡Enlace copiado!</DialogTitle>
              <DialogDescription className="text-center text-muted-foreground">
                El enlace del certificado ha sido copiado al portapapeles.
              </DialogDescription>
            </>
          ) : (
            <>
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4 mx-auto animate-bounce" />
              <DialogTitle className="text-2xl font-bold mb-2 text-red-600 text-center">Error</DialogTitle>
              <DialogDescription className="text-center text-muted-foreground">
                No se pudo copiar el enlace. Intenta nuevamente.
              </DialogDescription>
            </>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
