// components/UserListCard.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Loader2,
  RefreshCw,
  AlertCircle,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
} from "lucide-react"


interface User {
    uid_firebase: string;
    nombres: string;
    apellidos: string;
    correo: string;
    telefono?: string;
    estado: string;
    fechaCreacion: string;
}

interface Props {
    titulo: string;
    usuarios: User[];
    error: string | null;
    loading: boolean;
    onRetry: () => void;
    onDelete: (usuario: User) => void;
}

export const UserListCard = ({
    titulo,
    usuarios,
    error,
    loading,
    onRetry,
    onDelete,
}: Props) => {
    return (
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {titulo}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="flex items-center justify-between">
                                <span>{error}</span>
                                <Button variant="outline" size="sm" onClick={onRetry}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Reintentar
                                </Button>
                            </AlertDescription>
                        </Alert>
                    ) : loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            <span>Cargando usuarios...</span>
                        </div>
                    ) : usuarios.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No hay usuarios</h3>
                            <p className="text-muted-foreground">
                                Crea el primer usuario administrador
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Usuario</TableHead>
                                        <TableHead>Contacto</TableHead>
                                        <TableHead>Rol</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Fecha Creación</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {usuarios.map((usuario) => (
                                        <TableRow key={usuario.uid_firebase}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <Shield className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">
                                                            {usuario.nombres} {usuario.apellidos}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            ID: {usuario.uid_firebase}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Mail className="h-3 w-3" />
                                                        <span>{usuario.correo}</span>
                                                    </div>
                                                    {usuario.telefono && (
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <Phone className="h-3 w-3" />
                                                            <span>{usuario.telefono}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">admin2</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        usuario.estado === "Activo"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {usuario.estado}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        {new Date(
                                                            usuario.fechaCreacion
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onDelete(usuario)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
