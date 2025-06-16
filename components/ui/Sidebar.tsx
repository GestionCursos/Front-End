import Users from "@/app/models/User";
import StorageNavegador from "@/app/Services/StorageNavegador";
import {
  LayoutDashboard,
  UserPlus,
  Calendar,
  BookOpen,
  User,
  Settings,
  AlertCircleIcon,
  LogOut,

  TextSelectIcon,
  Edit,
  ClipboardList,

} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type SidebarProps = {
  active: string;
  onSelect: (section: string) => void;
};

const navItems = [
  { id: "pagina_principal", label: "Ir a la página principal", icon: LayoutDashboard, rolesPermitidos: ["admin", "admin2", "desarrollador"] },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, rolesPermitidos: ["admin", "admin2", "desarrollador"] },
  { id: "creacion_admin", label: "Crear Administradores", icon: UserPlus, rolesPermitidos: ["admin"] },
  { id: "eventos", label: "Eventos", icon: Calendar, rolesPermitidos: ["admin", "admin2"] },
  { id: "Secciones", label: "Secciones", icon: BookOpen, rolesPermitidos: ["admin", "admin2"] },
  { id: "autoridades", label: "Autoridades", icon: User, rolesPermitidos: ["admin", "admin2"] },
  { id: "solicitudes", label: "Solicitudes", icon: AlertCircleIcon, rolesPermitidos: ["admin", "admin2"] },
  { id: "mision_vision", label: "Mision y Vision", icon: Settings, rolesPermitidos: ["admin", "admin2"] },
  { id: "reportes", label: "Reportes", icon: TextSelectIcon, rolesPermitidos: ["admin", "admin2"] },
  { id: "calificaciones", label: "Calificaciones", icon: Edit, rolesPermitidos: ["admin", "admin2"] },
  { id: "inscripciones", label: "Inscripciones", icon: ClipboardList, rolesPermitidos: ["admin", "admin2"] },
  { id: "gestion_cambio", label: "Gestión de Cambio", icon: User, rolesPermitidos: ["desarrollador"] },
];

export default function Sidebar({ active, onSelect }: SidebarProps) {



  const user = StorageNavegador.getItemWithExpiry("user") as Users;

  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="w-64 h-screen flex flex-col justify-between bg-white border-r px-4 py-6">
      {/* Navegación */}
      <div>
        <h2 className="text-lg font-bold text-red-700 mb-6 px-2">Panel</h2>
        <nav className="space-y-1">
          {navItems
            .filter(item => item.rolesPermitidos.includes(user.rol)) 
            .map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  if (id === 'pagina_principal') {
                    router.push('/')
                  } else {
                    onSelect(id)
                  }
                }}
                className={`flex items-center gap-3 px-4 py-2 w-full rounded-md text-sm transition
                ${id === 'pagina_principal'
                    ? 'bg-gradient-to-r from-primary to-red-500 text-white font-bold shadow-lg border border-primary/60 hover:from-red-500 hover:to-primary'
                    : active === id
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'}
              `}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
        </nav>
      </div>

      {/* Usuario administrador con menú */}
      <div className="relative border-t pt-4 px-2" ref={menuRef}>
        <button
          onClick={() => setMenuVisible(!menuVisible)}
          className="w-full flex items-center gap-3 text-sm text-gray-800 hover:bg-gray-100 rounded-md px-2 py-2"
        >
          <User size={18} className="text-red-500" />
          <img src={user.urlUserImg} alt="perfil" className="w-8 h-8 rounded-full" />
          <div className="text-left">
            <p className="font-semibold">{user.username}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </button>

        {menuVisible && (
          <div className="absolute bottom-16 left-2 bg-white border rounded-md shadow-md w-48 z-50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

