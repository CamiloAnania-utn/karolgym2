import { useEffect, useState } from "react";
import api from "../../api/client";

export default function ChecksPage() {
  const [tab, setTab] = useState("mios");
  const [mine, setMine] = useState([]);
  const [community, setCommunity] = useState([]);
  const [form, setForm] = useState({ note: "", visibility: "privado" });

  useEffect(() => {
    api.get("/checks/mios").then((res) => setMine(res.data.checks));
    api.get("/checks/comunidad").then((res) => setCommunity(res.data.checks));
  }, []);

  async function createCheck(e) {
    e.preventDefault();
    const res = await api.post("/checks", form);
    setMine((m) => [res.data.check, ...m]);
    if (form.visibility === "publico") setCommunity((c) => [{ ...res.data.check, user: { name: "Vos" } }, ...c]);
    setForm({ note: "", visibility: "privado" });
  }

  return (
    <div className="space-y-8">
      <form onSubmit={createCheck} className="card p-5 space-y-4">
        <p className="font-display font-bold text-lg">Estoy entrenando. CHECK ✅</p>
        <textarea
          className="input"
          rows={2}
          placeholder="¿Cómo te fue hoy?"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-cream-muted">
            <input
              type="checkbox"
              className="accent-coral"
              checked={form.visibility === "publico"}
              onChange={(e) => setForm({ ...form, visibility: e.target.checked ? "publico" : "privado" })}
            />
            Compartir con la comunidad
          </label>
          <button type="submit" className="btn-primary !px-5 !py-2">Publicar check</button>
        </div>
      </form>

      <div className="flex gap-2">
        <button onClick={() => setTab("mios")} className={`badge border-cream/20 ${tab === "mios" ? "bg-coral text-ink border-coral" : "text-cream-muted"}`}>
          Mis checks
        </button>
        <button onClick={() => setTab("comunidad")} className={`badge border-cream/20 ${tab === "comunidad" ? "bg-coral text-ink border-coral" : "text-cream-muted"}`}>
          Comunidad
        </button>
      </div>

      <div className="space-y-3">
        {(tab === "mios" ? mine : community).map((c) => (
          <div key={c.id} className="card p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{c.user?.name || "Vos"}</p>
              <p className="text-xs text-cream-muted">{new Date(c.createdAt).toLocaleDateString("es-AR")}</p>
            </div>
            {c.note && <p className="text-sm text-cream-muted mt-2">{c.note}</p>}
          </div>
        ))}
        {(tab === "mios" ? mine : community).length === 0 && (
          <p className="text-cream-muted text-sm">Todavía no hay checks acá.</p>
        )}
      </div>
    </div>
  );
}
