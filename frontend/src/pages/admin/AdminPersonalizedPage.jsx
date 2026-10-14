import { useEffect, useState } from "react";
import api from "../../api/client";

const STATUS_LABEL = { pendiente: "Pendiente", aprobado: "Aprobado", rechazado: "Rechazado", activo: "Activo" };

export default function AdminPersonalizedPage() {
  const [requests, setRequests] = useState([]);

  async function refresh() {
    const res = await api.get("/admin/personalizados");
    setRequests(res.data.requests);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function setStatus(id, status) {
    await api.put(`/admin/personalizados/${id}`, { status });
    refresh();
  }

  return (
    <div>
      <h1 className="font-display font-extrabold text-3xl mb-6">Solicitudes de plan personalizado</h1>

      <div className="space-y-4">
        {requests.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-semibold">{r.user?.name} <span className="text-cream-muted font-normal">· {r.user?.email}</span></p>
                <p className="text-xs text-cream-muted mt-0.5">{new Date(r.createdAt).toLocaleDateString("es-AR")}</p>
              </div>
              <span className="badge border-cream/20 text-cream-muted">{STATUS_LABEL[r.status]}</span>
            </div>

            <dl className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
              <div><dt className="text-cream-muted text-xs uppercase">Objetivo</dt><dd>{r.formData?.objetivo}</dd></div>
              <div><dt className="text-cream-muted text-xs uppercase">Nivel</dt><dd>{r.formData?.nivel}</dd></div>
              <div><dt className="text-cream-muted text-xs uppercase">Días disponibles</dt><dd>{r.formData?.diasDisponibles}</dd></div>
              <div><dt className="text-cream-muted text-xs uppercase">Lesiones</dt><dd>{r.formData?.lesiones || "—"}</dd></div>
            </dl>
            {r.formData?.comentarios && <p className="text-sm text-cream-muted mt-3">{r.formData.comentarios}</p>}

            {r.status === "pendiente" && (
              <div className="flex gap-2 mt-4">
                <button onClick={() => setStatus(r.id, "aprobado")} className="btn-secondary !px-4 !py-2 text-sm">Aprobar</button>
                <button onClick={() => setStatus(r.id, "rechazado")} className="btn-ghost !px-4 !py-2 text-sm text-coral">Rechazar</button>
              </div>
            )}
          </div>
        ))}
        {requests.length === 0 && <p className="text-cream-muted">No hay solicitudes todavía.</p>}
      </div>
    </div>
  );
}
