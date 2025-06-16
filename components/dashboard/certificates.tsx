import { useEffect, useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select"
import User from "../../app/models/User"
import {
  Award,
  Download,
  Share2,
  Search,
  Filter,
  GraduationCap,
  CheckCircle,
  ExternalLink,
  Star,
  Clock,
} from "lucide-react"
import StorageNavegador from "@/app/Services/StorageNavegador"
import { ShareSuccessModal } from "../ShareSuccessModal"

// Interface for certificate data with related event and inscription info

interface SimpleCertificate {
  id_certificado: number;
  nombre: string;
  url_certificado: string;
  url_foto: string;
  categoria: string;
  nota: number | null;
  numero_horas: number;
}


interface CertificatesProps {
  user: User
}

export function Certificates({ user }: CertificatesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [certificates, setCertificates] = useState<SimpleCertificate[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const uniqueCategories = ["all", ...new Set(certificates.map(cert => cert.categoria.toLowerCase()))];
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      setLoading(true)
      setError(null)
      try {
        const uid = user.uid_firebase || user.uid
        if (!uid) {
          setCertificates([])
          setLoading(false)
          return
        }
        const idTokenString = StorageNavegador.getItemWithExpiry("user") as User
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/certificado`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idTokenString?.token}`
          }
        })
        const data: SimpleCertificate[] = await res.json()
        setCertificates(data)
      } catch (e) {
        setError("Error al cargar certificados")
        setCertificates([])
      }
      setLoading(false)
    }
    fetchCertificates()
  }, [user])

  const filteredCertificates = certificates.filter(cert =>
    (filterBy === "all" || cert.categoria.toLowerCase() === filterBy.toLowerCase()) &&
    cert.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const stats = {
    totalCertificates: certificates.length,
    totalHours: certificates.reduce((sum, cert) => sum + (cert.numero_horas || 0), 0),
    avgGrade: (() => {
      const validNotas = certificates.filter(cert => typeof cert.nota === 'number' && cert.nota !== null);
      if (validNotas.length === 0) return "--";
      const sumNotas = validNotas.reduce((sum, cert) => sum + (cert.nota as number), 0);
      return (sumNotas / validNotas.length).toFixed(1);
    })(),
    categoriesCompleted: new Set(certificates.map(cert => cert.categoria.toLowerCase())).size
  };

  const handleShare = (cert: SimpleCertificate) => {
    const shareUrl = `${cert.url_certificado}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setShareSuccess(true);
        setShareModalOpen(true);
      })
      .catch(() => {
        setShareSuccess(false);
        setShareModalOpen(true);
      });
  };




  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Error cargando certificados</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="auth-button">
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">      {/* Header con estadísticas */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Mis Certificados</h1>
        <p className="text-muted-foreground mb-6">
          Visualiza y gestiona todos tus certificados de eventos completados
        </p>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Certificados</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalCertificates}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Horas totales</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Calificación promedio</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.avgGrade}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categorías</p>
                  <p className="text-2xl font-bold text-green-600">{stats.categoriesCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por evento, categoría o tipo de certificado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

            </div>
            <div className="flex gap-2">

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "Todas las categorías" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
          </div>
        </CardContent>
      </Card>
      {/* Lista de certificados */}
      <div>
        {filteredCertificates.map(cert => (
          <Card key={cert.id_certificado}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <img src={cert.url_foto} alt={cert.nombre} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-bold">{cert.nombre}</h3>
                  <p className="text-sm text-muted-foreground">
                    ID: CERT-{cert.id_certificado.toString().padStart(4, '0')}
                  </p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {cert.categoria}
                  </Badge>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={() => window.open(cert.url_certificado, '_blank')}>
                      <Download className="h-4 w-4 mr-2" /> Descargar
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare(cert)}
                    >
                      <Share2 className="h-4 w-4 mr-2" /> Compartir
                    </Button>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        ))}

      </div>

      {/* Estado vacío */}
      {filteredCertificates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No se encontraron certificados
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterBy !== "all"
                ? "Intenta ajustar tus filtros de búsqueda"
                : "Aún no tienes certificados. ¡Completa un evento para obtener tu primer certificado!"}
            </p>
            <Button className="auth-button">
              Explorar eventos disponibles
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Información adicional */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Verificación de Certificados</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Todos nuestros certificados son verificables digitalmente y están respaldados por nuestro sistema
                de inscripciones. Cada certificado incluye información del evento, fecha de emisión y tipo de certificación obtenida.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Verificar certificado
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir perfil
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ShareSuccessModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        success={shareSuccess}
      />
    </div>
  )
}
