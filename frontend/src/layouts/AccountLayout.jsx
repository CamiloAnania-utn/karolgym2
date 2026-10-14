import { NavLink, Outlet } from "react-router-dom";

const LINKS = [
  { to: "/cuenta", label: "Perfil", end: true },
  { to: "/cuenta/packs", label: "Mis packs" },
  { to: "/cuenta/calendario", label: "Calendario" },
  { to: "/cuenta/favoritos", label: "Favoritos" },
  { to: "/cuenta/historial", label: "Historial" },
  { to: "/cuenta/caminatas", label: "Caminatas" },
  { to: "/cuenta/checks", label: "Checks" },
];

export default function AccountLayout() {
  return (
    <div className="section py-8 lg:py-12">
      <h1 className="font-display font-extrabold text-3xl mb-6">Mi cuenta</h1>

      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
        <nav
          className="flex lg:flex-col gap-1 overflow-x-auto pb-2 mb-6 lg:mb-0 border-b lg:border-b-0 lg:border-r border-ink-line
                     [-webkit-overflow-scrolling:touch]"
        >
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isActive ? "text-coral bg-coral/10 lg:border-r-2 lg:border-coral" : "text-cream/70 hover:text-cream"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
