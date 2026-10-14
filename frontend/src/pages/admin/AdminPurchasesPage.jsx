import { useEffect, useState } from "react";
import api from "../../api/client";

const STATUS_LABEL = { pendiente: "Pendiente", confirmado: "Confirmado", rechazado: "Rechazado" };
const STATUS_COLOR = { pendiente: "text-gold border-gold/40", confirmado: "text-moss border-moss/40", rechazado: "text-coral border-coral/40" };

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [filter, setFilter] = useState("pendiente");

  async function refresh() {
    const res = await api.get("/admin/compras", { params: filter ? { status: filter } : {} });
    setPurchases(res.data.purchases);
  }

  useEffect(() => {
    refresh();
  }, [filter]);

  async function confirm_(id) {
    await api.post(`/admin/compras/${id}/confirmar`);
    refresh();
  }
  async function reject(id) {
    if (!confirm("¿Rechazar esta compra?")) return;
    await api.post(`/admin/compras/${id}/rechazar`);
    refresh();
  }

  return (
    <div>
      <h1 className="font-display font-extrabold text-3xl mb-6">Compras</h1>

      <div className="flex gap-2 mb-6">
        {["pendiente", "confirmado", "rechazado", ""].map((s) => (
          <button
            key={s || "todas"}
            onClick={() => setFilter(s)}
            className={`badge border-cream/20 ${filter === s ? "bg-coral text-ink border-coral" : "text-cream-muted"}`}
          >
            {s ? STATUS_LABEL[s] : "Todas"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {purchases.map((p) => (
          <div key={p.id} className="card p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold">{p.user?.name} <span className="text-cream-muted font-normal">· {p.user?.email}</span></p>
              <p className="text-sm text-cream-muted mt-0.5">{p.subPack?.name} · ${p.amount} · {p.paymentMethod === "mercado_pago" ? "Mercado Pago" : "Transferencia"}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`badge ${STATUS_COLOR[p.status]}`}>{STATUS_LABEL[p.status]}</span>
              {p.status === "pendiente" && (
                <>
                  <button onClick={() => confirm_(p.id)} className="btn-secondary !px-3 !py-1.5 text-xs">Confirmar</button>
                  <button onClick={() => reject(p.id)} className="btn-ghost !px-3 !py-1.5 text-xs text-coral">Rechazar</button>
                </>
              )}
            </div>
          </div>
        ))}
        {purchases.length === 0 && <p className="text-cream-muted">No hay compras en este estado.</p>}
      </div>
    </div>
  );
}
