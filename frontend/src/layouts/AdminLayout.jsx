import { NavLink, Outlet, Link } from "react-router-dom";
import Logo from "../components/Logo";

const LINKS = [
  { to: "/admin", label: "Estadísticas", end: true },
  { to: "/admin/packs", label: "Packs de entrenamiento" },
  { to: "/admin/contenido-gratis", label: "Contenido gratis" },
  { to: "/admin/compras", label: "Compras" },
  { to: "/admin/usuarios", label: "Usuarios / alumnos" },
  { to: "/admin/personalizados", label: "Personalizados" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b lg:border-b-0 lg:border-r border-ink-line bg-ink-surface">
        <div className="px-5 h-16 flex items-center border-b border-ink-line">
          <Link to="/">
            <Logo />
          </Link>
          <span className="ml-2 text-xs text-cream-muted font-semibold">PANEL</span>
        </div>
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible p-2 gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isActive ? "bg-coral text-ink" : "text-cream/75 hover:text-cream hover:bg-ink-raised"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="section py-8">
        <Outlet />
      </main>
    </div>
  );
}
