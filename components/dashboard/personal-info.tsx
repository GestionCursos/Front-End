import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import User from "../../app/models/User"
import { User as UserIcon, Mail, Phone, MapPin, Edit, Save, X, Camera, Shield } from "lucide-react"
import { updateUsuario, getUsuarioByFirebaseUid, getDashboardDataUsuario, updateUsuarioPassword } from "../../app/Services/usuarioService"
import { getCarreras } from "../../app/Services/sectionsService"
import { useRouter } from "next/navigation"
import StorageNavegador from "@/app/Services/StorageNavegador"


export function PersonalInfo({ user: propUser }: { user?: User }) {
  const [user, setUser] = useState<User | null>(propUser || null)
  const router = useRouter()

  useEffect(() => {
    if (propUser) {
      console.log("PersonalInfo - Usuario recibido como prop:", propUser);
      setUser(propUser);
    } else if (typeof window !== "undefined") {
      const storedUser = StorageNavegador.getItemWithExpiry("user") as User;
      console.log("PersonalInfo - Usuario desde localStorage:", storedUser);
      if (storedUser) {
        setUser(storedUser);
      } else {
        // No hay usuario -> login
        router.push("/pages/login");
      }
    }
    setLoading(false);
  }, [propUser, router]);

  const [isEditing, setIsEditing] = useState(false)
  // Estados para filtros
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    direccion: "",
    url_foto: "",
    idCarrera: ""
  })

  const [carreras, setCarreras] = useState<any[]>([])

  // Configuración dinámica de los campos del formulario
  const formFields = [
    {
      key: "nombres",
      label: "Nombres",
      type: "text",
      icon: UserIcon,
      required: true,
      placeholder: "Ingresa tus nombres"
    },
    {
      key: "apellidos", 
      label: "Apellidos",
      type: "text",
      icon: UserIcon,
      required: true,
      placeholder: "Ingresa tus apellidos"
    },
    {
      key: "correo",
      label: "Correo Electrónico",
      type: "email",
      icon: Mail,
      required: true,
      placeholder: "ejemplo@correo.com"
    },
    {
      key: "telefono",
      label: "Teléfono",
      type: "tel",
      icon: Phone,
      required: false,
      placeholder: "Número de teléfono"
    },
    {
      key: "direccion",
      label: "Dirección",
      type: "text",
      icon: MapPin,
      required: false,
      placeholder: "Tu dirección completa",
      fullWidth: true
    }
  ]

  // Cargar carreras disponibles
  useEffect(() => {
    const cargarCarreras = async () => {
      try {
        const carrerasData = await getCarreras()
        setCarreras(carrerasData)
      } catch (error) {
        console.error("Error al cargar carreras:", error)
      }
    }
    cargarCarreras()
  }, [])

  useEffect(() => {
    if (user) {
      // Obtener el ID de carrera si existe una relación
      let carreraId = "";
      if (user.carrera && carreras.length > 0) {
        const carreraEncontrada = carreras.find(c => c.nombre === user.carrera);
        carreraId = carreraEncontrada ? carreraEncontrada.id.toString() : "";
      }
      
      setFormData({
        nombres: user.nombres || "",
        apellidos: user.apellidos || "",
        correo: user.correo || user.email || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
        url_foto: user.url_foto || user.urlUserImg || "",
        idCarrera: carreraId
      })
    }
  }, [user, carreras])
  const [accountInfo, setAccountInfo] = useState({
    memberSince: "-",
    lastLogin: "-",
    totalEvents: 0,
    completedEvents: 0,
    certificates: 0,
    attendances: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [isPhotoEditing, setIsPhotoEditing] = useState(false)

  const [isDataLoaded, setIsDataLoaded] = useState(false)

  // Efecto separado para actualizar el idCarrera cuando se cargan las carreras
  useEffect(() => {
    if (user?.carrera && carreras.length > 0 && isDataLoaded) {
      const carreraEncontrada = carreras.find(c => c.nombre === user.carrera);
      if (carreraEncontrada) {
        setFormData(prev => ({
          ...prev,
          idCarrera: carreraEncontrada.id.toString()
        }));
      }
    }
  }, [carreras, user?.carrera, isDataLoaded]);

  useEffect(() => {
    async function fetchStats() {
      if (!user || isDataLoaded) return;
      
      setLoading(true)
      setError(null)
      try {
        const uid = user.uid_firebase || user.uid || ""
        if (!uid) {
          setLoading(false)
          return
        }
        
        // Usar el endpoint avanzado para obtener todo
        const dashboardData = await getDashboardDataUsuario(uid)
        console.log("Datos del dashboard desde backend:", dashboardData);
        
        // Actualizar datos de perfil y estadísticas
        if (dashboardData && dashboardData.user) {
          // Actualizar el estado del usuario con los datos del backend
          const updatedUser = { ...user, ...dashboardData.user };
          setUser(updatedUser);
          
          // Obtener el ID de carrera si existe una relación y hay carreras cargadas
          let carreraId = "";
          if (dashboardData.user.carrera && carreras.length > 0) {
            const carreraEncontrada = carreras.find(c => c.nombre === dashboardData.user.carrera);
            carreraId = carreraEncontrada ? carreraEncontrada.id.toString() : "";
          } else if (dashboardData.user.carrera) {
            // Si no hay carreras cargadas aún, usar directamente el nombre
            carreraId = dashboardData.user.carrera;
          }
          
          setFormData({
            nombres: dashboardData.user.nombres || "",
            apellidos: dashboardData.user.apellidos || "",
            correo: dashboardData.user.correo || dashboardData.user.email || "",
            telefono: dashboardData.user.telefono || "",
            direccion: dashboardData.user.direccion || "",
            url_foto: dashboardData.user.url_foto || dashboardData.user.urlUserImg || "",
            idCarrera: carreraId
          })
        }
        
        // Estadísticas
        const eventos = dashboardData.eventosInscritos || []
        setAccountInfo({
          memberSince: "-", // Puedes mapear si el backend lo provee
          lastLogin: "-",   // Puedes mapear si el backend lo provee
          totalEvents: eventos.length,
          completedEvents: eventos.filter((i: any) => i.estado_inscripcion === 'completado').length,
          certificates: eventos.filter((i: any) => i.estado_inscripcion === 'completado' && i.nota >= 70).length,
          attendances: eventos.reduce((sum: any, i: any) => sum + (i.porcentaje_asistencia || 0), 0)
        })
        
        setIsDataLoaded(true)
      } catch (e: any) {
        setError(e.message || "Error cargando estadísticas")
      }
      setLoading(false)
    }
    fetchStats()
  }, [user?.uid_firebase, user?.uid]) // Solo depender del UID, no del objeto user completo

  const reloadUserData = async () => {
    if (!user) return;

    setLoading(true)
    setError(null)
    try {
      const uid = user.uid_firebase || user.uid || ""
      if (!uid) return
      
      const backendUser = await getUsuarioByFirebaseUid(uid)
      
      // Obtener el ID de carrera si existe una relación
      let carreraId = "";
      if (backendUser.idCarrera?.nombre && carreras.length > 0) {
        const carreraEncontrada = carreras.find(c => c.nombre === backendUser.idCarrera.nombre);
        carreraId = carreraEncontrada ? carreraEncontrada.id.toString() : "";
      }
      
      setFormData({
        nombres: backendUser.nombres || "",
        apellidos: backendUser.apellidos || "",
        correo: backendUser.correo || backendUser.email || "",
        telefono: backendUser.telefono || "",
        direccion: backendUser.direccion || "",
        url_foto: backendUser.url_foto || backendUser.urlUserImg || "",
        idCarrera: carreraId
      })
    } catch (e: any) {
      setError("No se pudo recargar los datos del usuario")
    }
    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordFields(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      if (!user) {
        throw new Error("No se encontró el usuario")
      }

      // Validaciones dinámicas basadas en la configuración de campos
      for (const field of formFields) {
        if (field.required) {
          const value = formData[field.key as keyof typeof formData]
          if (!value || !value.toString().trim()) {
            throw new Error(`${field.label} es requerido`)
          }
        }
      }
      
      // Validar formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.correo)) {
        throw new Error("El formato del correo no es válido")
      }

      const uid = user.uid_firebase || user.uid || "";
      if (!uid) {
        throw new Error("No se encontró el UID del usuario")
      }

      // Preparar datos para enviar al backend
      const dataToSend: any = { ...formData };
      
      // Si hay una carrera seleccionada, convertir el ID a nombre
      if (formData.idCarrera && carreras.length > 0) {
        const carreraSeleccionada = carreras.find(c => c.id.toString() === formData.idCarrera);
        if (carreraSeleccionada) {
          dataToSend.carrera = carreraSeleccionada.nombre;
        }
      }
      
      // Remover idCarrera ya que el backend espera 'carrera'
      delete dataToSend.idCarrera;

      // Actualizar datos del usuario
      await updateUsuario(uid, dataToSend);
      
      // If password fields are shown and filled, validate and update password
      if (showPasswordFields && (passwordFields.currentPassword || passwordFields.newPassword || passwordFields.confirmPassword)) {
        if (!passwordFields.currentPassword || !passwordFields.newPassword || !passwordFields.confirmPassword) {
          throw new Error("Completa todos los campos de contraseña")
        }
        if (passwordFields.newPassword.length < 6) {
          throw new Error("La nueva contraseña debe tener al menos 6 caracteres")
        }
        if (passwordFields.newPassword !== passwordFields.confirmPassword) {
          throw new Error("Las contraseñas nuevas no coinciden")
        }
        // Call password update service
        await updateUsuarioPassword(uid, passwordFields.currentPassword, passwordFields.newPassword)
        setSuccess("Perfil y contraseña actualizados correctamente.")
      } else {
        setSuccess("Perfil actualizado correctamente.")
      }

      // Update local storage with new data
      const updatedUser = { ...user, ...formData };
      StorageNavegador.saveToLocalStorageWithExpiry("user", updatedUser, 24 * 60 * 60 * 1000); // 24 horas

      setIsEditing(false)
      setShowPasswordFields(false)
      setPasswordFields({ currentPassword: "", newPassword: "", confirmPassword: "" })
      await reloadUserData()
    } catch (e: any) {
      setError(e.message || "Error guardando cambios")
    }
    setSaving(false)
  }

  const handleCancel = () => {
    if (!user) return;

    // Obtener el ID de carrera si existe una relación
    let carreraId = "";
    if (user.carrera && carreras.length > 0) {
      const carreraEncontrada = carreras.find(c => c.nombre === user.carrera);
      carreraId = carreraEncontrada ? carreraEncontrada.id.toString() : "";
    }

    setFormData({
      nombres: user.nombres || "",
      apellidos: user.apellidos || "",
      correo: user.correo || user.email || "",
      telefono: user.telefono || "",
      direccion: user.direccion || "",
      url_foto: user.url_foto || user.urlUserImg || "",
      idCarrera: carreraId
    })
    setIsEditing(false)
    setShowPasswordFields(false)
    setIsPhotoEditing(false)
    setPasswordFields({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  return (
    <div className="space-y-6">
      {loading && (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Cargando información...</p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <Save className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Éxito</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>{success}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Información Personal</h1>
          <p className="text-muted-foreground">
            Gestiona tu perfil y preferencias de cuenta
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="auth-button">
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="auth-button" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Guardando..." : "Guardar"}
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Foto de Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                  {formData.url_foto ? (
                    <img
                      src={formData.url_foto}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Si la imagen falla al cargar, mostrar el icono por defecto
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <UserIcon className="h-16 w-16 text-primary" />
                  )}
                  {formData.url_foto && (
                    <UserIcon className="h-16 w-16 text-primary hidden" />
                  )}
                </div>
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <Button
                      size="sm"
                      className="rounded-full w-8 h-8 p-0"
                      variant="default"
                      title="Cambiar foto de perfil"
                      onClick={() => setIsPhotoEditing(!isPhotoEditing)}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Editor de URL de foto */}
              {isEditing && isPhotoEditing && (
                <div className="space-y-2">
                  <Label htmlFor="photo-url">URL de la foto de perfil</Label>
                  <Input
                    id="photo-url"
                    type="url"
                    value={formData.url_foto}
                    onChange={(e) => handleInputChange("url_foto", e.target.value)}
                    placeholder="https://ejemplo.com/tu-foto.jpg"
                    className="auth-input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ingresa la URL de tu foto de perfil
                  </p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {(formData.nombres && formData.apellidos) ? 
                    `${formData.nombres} ${formData.apellidos}` : 
                    (user?.username || "Usuario")
                  }
                </h3>
                <div className="flex justify-center mt-2">
                  {user?.rol && (
                    <Badge className={`${user.rol} text-xs`}>
                      {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Estadísticas de Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Estado</span>
                <Badge className={`${user?.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} text-xs`}>
                  {user?.estado?.toUpperCase() || 'ACTIVO'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Eventos totales</span>
                <span className="font-semibold">{accountInfo.totalEvents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completados</span>
                <span className="font-semibold">{accountInfo.completedEvents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Certificados</span>
                <span className="font-semibold">{accountInfo.certificates}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">% Asistencia promedio</span>
                <span className="font-semibold">
                  {accountInfo.totalEvents > 0 ? 
                    Math.round(accountInfo.attendances / accountInfo.totalEvents) + '%' : 
                    '0%'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Último acceso</span>
                <span className="text-sm">{accountInfo.lastLogin}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Formulario dinámico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.filter(field => !field.fullWidth).map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {isEditing ? (
                      <Input
                        id={field.key}
                        type={field.type}
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="auth-input"
                        required={field.required}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <field.icon className="h-4 w-4 text-muted-foreground" />
                        <span>{formData[field.key as keyof typeof formData] || "No especificado"}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Campos de ancho completo */}
              {formFields.filter(field => field.fullWidth).map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {isEditing ? (
                    <Input
                      id={field.key}
                      type={field.type}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="auth-input"
                      required={field.required}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <field.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{formData[field.key as keyof typeof formData] || "No especificado"}</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Campo de carrera dinámico */}
              <div className="space-y-2">
                <Label htmlFor="idCarrera">Carrera</Label>
                {isEditing ? (
                  <Select
                    value={formData.idCarrera || "sin-especificar"}
                    onValueChange={(value) => handleInputChange("idCarrera", value === "sin-especificar" ? "" : value)}
                  >
                    <SelectTrigger className="auth-input">
                      <SelectValue placeholder="Selecciona tu carrera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sin-especificar">Sin especificar</SelectItem>
                      {carreras.map((carrera) => (
                        <SelectItem key={carrera.id} value={carrera.id.toString()}>
                          {carrera.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {user?.carrera || "No especificado"}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Estado de Verificación</Label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Badge
                    className={`${user?.verify ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      } text-xs`}
                  >
                    {user?.verify ? 'Verificado' : 'Pendiente de verificación'}
                  </Badge>
                </div>
              </div>

              {/* Campos de contraseña condicionales */}
              {isEditing && showPasswordFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordFields.currentPassword}
                      onChange={e => handlePasswordChange("currentPassword", e.target.value)}
                      className="auth-input"
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordFields.newPassword}
                      onChange={e => handlePasswordChange("newPassword", e.target.value)}
                      className="auth-input"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordFields.confirmPassword}
                      onChange={e => handlePasswordChange("confirmPassword", e.target.value)}
                      className="auth-input"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Configuración de Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium">Notificaciones por email</h4>
                  <p className="text-sm text-muted-foreground">
                    Recibe actualizaciones sobre tus eventos y certificados
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium">Privacidad del perfil</h4>
                  <p className="text-sm text-muted-foreground">
                    Controla quién puede ver tu información
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Gestionar
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium">Cambiar contraseña</h4>
                  <p className="text-sm text-muted-foreground">
                    Actualiza tu contraseña de acceso
                  </p>
                </div>
                {isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setShowPasswordFields(v => !v)}>
                    {showPasswordFields ? "Ocultar" : "Editar"}
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Cambiar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
