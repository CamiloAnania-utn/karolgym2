import { useEffect, useState } from "react";
import api from "../../api/client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    api.get("/admin/usuarios").then((res) => setUsers(res.data.users));
  }, []);

  async function openUser(user) {
    setSelected(user);
    const res = await api.get(`/admin/usuarios/${user.id}`);
    setDetail(res.data);
  }

  return (
    <div>
      <h1 className="font-display font-extrabold text-3xl mb-6">Usuarios / alumnos</h1>

      <div className="lg:grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <div className="space-y-2">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => openUser(u)}
              className={`card p-4 w-full text-left flex items-center justify-between transition-colors ${selected?.id === u.id ? "border-coral/60" : ""}`}
            >
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-xs text-cream-muted">{u.email}</p>
              </div>
              {u.role === "admin" && <span className="badge border-cream/20 text-cream-muted">Admin</span>}
            </button>
          ))}
        </div>

        <div className="mt-6 lg:mt-0">
          {!selected && <p className="text-cream-muted">Elegí un usuario para ver su detalle.</p>}
          {selected && detail && (
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="font-display font-bold text-xl">{detail.user.name}</h2>
                <p className="text-sm text-cream-muted">{detail.user.email} {detail.user.phone ? `· ${detail.user.phone}` : ""}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-ink-raised p-4">
                  <p className="text-2xl font-display font-bold text-coral">{detail.activePacks.length}</p>
                  <p className="text-xs text-cream-muted">packs activos</p>
                </div>
                <div className="bg-ink-raised p-4">
                  <p className="text-2xl font-display font-bold text-coral">{detail.completedWorkoutsCount}</p>
                  <p className="text-xs text-cream-muted">entrenamientos completados</p>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Packs activos</p>
                {detail.activePacks.length === 0 && <p className="text-sm text-cream-muted">Ninguno todavía.</p>}
                {detail.activePacks.map((ap) => (
                  <div key={ap.id} className="flex items-center justify-between py-2 border-b border-ink-line last:border-0">
                    <span className="text-sm">{ap.subPack?.name}</span>
                    <span className="text-xs text-cream-muted">{ap.active ? "Activo" : "Inactivo"}</span>
                  </div>
                ))}
              </div>

              {detail.personalizedRequests.length > 0 && (
                <div>
                  <p className="font-semibold mb-2">Solicitudes de plan personalizado</p>
                  {detail.personalizedRequests.map((r) => (
                    <div key={r.id} className="text-sm py-2 border-b border-ink-line last:border-0">
                      <span className="badge border-cream/20 text-cream-muted mr-2">{r.status}</span>
                      {r.formData?.objetivo}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
