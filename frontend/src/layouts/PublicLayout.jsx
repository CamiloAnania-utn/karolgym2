import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const NAV_LINKS = [
  { to: "/gratis", label: "Contenido gratis" },
  { to: "/packs", label: "Packs" },
  { to: "/personalizados", label: "Personalizado 1:1" },
];

export default function PublicLayout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-ink/95 backdrop-blur border-b border-ink-line">
        <div className="section flex items-center justify-between h-16">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isActive ? "text-coral" : "text-cream/80 hover:text-cream"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/cuenta" className="btn-ghost">
                  {user.name.split(" ")[0]}
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="btn-secondary !px-4 !py-2">
                    Panel
                  </Link>
                )}
                <button onClick={logout} className="btn-ghost">
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/ingresar" className="btn-ghost">
                  Iniciar sesión
                </Link>
                <Link to="/crear-cuenta" className="btn-primary !px-5 !py-2.5">
                  Crear cuenta
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <div className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-6 bg-cream transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 w-6 bg-cream transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-cream transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-ink-line bg-ink">
            <nav className="section py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-3 text-base font-semibold border-b border-ink-line/60 ${
                      isActive ? "text-coral" : "text-cream/90"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  <Link to="/cuenta" onClick={() => setMenuOpen(false)} className="py-3 text-base font-semibold border-b border-ink-line/60">
                    Mi cuenta
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="py-3 text-base font-semibold border-b border-ink-line/60">
                      Panel admin
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="py-3 text-base font-semibold text-left text-cream/70">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-4">
                  <Link to="/ingresar" onClick={() => setMenuOpen(false)} className="btn-secondary flex-1">
                    Ingresar
                  </Link>
                  <Link to="/crear-cuenta" onClick={() => setMenuOpen(false)} className="btn-primary flex-1">
                    Crear cuenta
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-ink-line">
        <div className="section py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-cream-muted">
          <Logo className="text-base" />
          <p>© {new Date().getFullYear()} KAROLGYM. Entrená a tu manera.</p>
        </div>
      </footer>
    </div>
  );
}
