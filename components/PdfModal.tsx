import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface PdfModalProps {
    open: boolean
    onClose: () => void
    pdfUrl: string
}

export function PdfModal({ open, onClose, pdfUrl }: PdfModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-4xl h-[80vh] p-0 overflow-hidden">
                {/* Esto es necesario para accesibilidad */}
                <DialogTitle className="sr-only">Vista previa del certificado</DialogTitle>

                <iframe
                    src={pdfUrl}
                    className="w-full h-full"
                    title="Vista previa del certificado"
                />
            </DialogContent>
        </Dialog>
    )
}
