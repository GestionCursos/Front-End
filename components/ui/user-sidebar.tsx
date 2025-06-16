import User from "../../app/models/User"
import StorageNavegador from "../../app/Services/StorageNavegador"
import {
  LayoutDashboard,
  BookOpen,
  User as UserIcon,
  Award,
  Settings,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"

type UserSidebarProps = {
  active: string
  onSelect: (section: string) => void
  user: User
}

const navItems = [
  { id: "dashboard", label: "Panel Principal", icon: LayoutDashboard },
  { id: "events", label: "Mis Eventos", icon: BookOpen },
  { id: "personal", label: "Información Personal", icon: UserIcon },
  { id: "certificates", label: "Certificados", icon: Award },
]

export function UserSidebar({ active, onSelect, user }: UserSidebarProps) {
  const [menuVisible, setMenuVisible] = useState(false)
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <aside className="w-64 h-full flex flex-col justify-between bg-card border-r border-border shadow-sm">      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center">
          <h2 className="text-lg font-bold text-primary">Dashboard</h2>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium transition-all duration-200 ${
                active === id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Usuario con menú */}
      <div className="relative border-t border-border p-4" ref={menuRef}>
        <button
          onClick={() => setMenuVisible(!menuVisible)}
          className="w-full flex items-center gap-3 text-sm text-foreground hover:bg-accent rounded-lg px-3 py-3 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
            <UserIcon size={20} className="text-primary" />
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold text-foreground">{user.username || "Usuario"}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </button>

        {menuVisible && (
          <div className="absolute bottom-20 left-4 right-4 bg-popover border border-border rounded-lg shadow-lg z-50">
            <div className="p-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
