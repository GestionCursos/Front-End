import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Input,
    Label,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from "@/components/ui";
  import {
    UserPlus,
    Eye,
    EyeOff,
    Loader2,
  } from "lucide-react";
  
  interface Formulario {
    nombres: string;
    apellidos: string;
    correo: string;
    telefono?: string;
    contraseña: string;
    confirmarContraseña: string;
    rol: string;
  }
  
  interface ErroresValidacion {
    nombres?: string;
    apellidos?: string;
    correo?: string;
    contraseña?: string;
    confirmarContraseña?: string;
    rol?: string;
  }
  
  interface Props {
    formulario: Formulario;
    erroresValidacion: ErroresValidacion;
    mostrarContraseña: boolean;
    mostrarConfirmarContraseña: boolean;
    submitting: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleInputChange: (campo: keyof Formulario, valor: string) => void;
    setMostrarContraseña: (mostrar: boolean) => void;
    setMostrarConfirmarContraseña: (mostrar: boolean) => void;
  }
  
  export const FormularioCrearUsuario = ({
    formulario,
    erroresValidacion,
    mostrarContraseña,
    mostrarConfirmarContraseña,
    submitting,
    handleSubmit,
    handleInputChange,
    setMostrarContraseña,
    setMostrarConfirmarContraseña,
  }: Props) => {
    return (
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Crear Nuevo Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombres">Nombres *</Label>
                  <Input
                    id="nombres"
                    value={formulario.nombres}
                    onChange={(e) => handleInputChange("nombres", e.target.value)}
                    placeholder="Nombres"
                    className={erroresValidacion.nombres ? "border-destructive" : ""}
                  />
                  {erroresValidacion.nombres && (
                    <p className="text-sm text-destructive">{erroresValidacion.nombres}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    value={formulario.apellidos}
                    onChange={(e) => handleInputChange("apellidos", e.target.value)}
                    placeholder="Apellidos"
                    className={erroresValidacion.apellidos ? "border-destructive" : ""}
                  />
                  {erroresValidacion.apellidos && (
                    <p className="text-sm text-destructive">{erroresValidacion.apellidos}</p>
                  )}
                </div>
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico *</Label>
                <Input
                  id="correo"
                  type="email"
                  value={formulario.correo}
                  onChange={(e) => handleInputChange("correo", e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={erroresValidacion.correo ? "border-destructive" : ""}
                />
                {erroresValidacion.correo && (
                  <p className="text-sm text-destructive">{erroresValidacion.correo}</p>
                )}
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formulario.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="+57 300 123 4567"
                />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="contraseña">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="contraseña"
                    type={mostrarContraseña ? "text" : "password"}
                    value={formulario.contraseña}
                    onChange={(e) => handleInputChange("contraseña", e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className={erroresValidacion.contraseña ? "border-destructive pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setMostrarContraseña(!mostrarContraseña)}
                  >
                    {mostrarContraseña ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {erroresValidacion.contraseña && (
                  <p className="text-sm text-destructive">{erroresValidacion.contraseña}</p>
                )}
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="confirmarContraseña">Confirmar Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="confirmarContraseña"
                    type={mostrarConfirmarContraseña ? "text" : "password"}
                    value={formulario.confirmarContraseña}
                    onChange={(e) => handleInputChange("confirmarContraseña", e.target.value)}
                    placeholder="Confirma tu contraseña"
                    className={erroresValidacion.confirmarContraseña ? "border-destructive pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setMostrarConfirmarContraseña(!mostrarConfirmarContraseña)}
                  >
                    {mostrarConfirmarContraseña ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {erroresValidacion.confirmarContraseña && (
                  <p className="text-sm text-destructive">{erroresValidacion.confirmarContraseña}</p>
                )}
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="rol">Rol *</Label>
                <Select
                  value={formulario.rol}
                  onValueChange={(value) => handleInputChange("rol", value)}
                >
                  <SelectTrigger className={erroresValidacion.rol ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin2">Administrador-General</SelectItem>
                    <SelectItem value="desarrollador">Desarrollador</SelectItem>
                  </SelectContent>
                </Select>
                {erroresValidacion.rol && (
                  <p className="text-sm text-destructive">{erroresValidacion.rol}</p>
                )}
              </div>
  
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <UserPlus className="h-4 w-4 mr-2" />
                Crear Usuario
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };
  