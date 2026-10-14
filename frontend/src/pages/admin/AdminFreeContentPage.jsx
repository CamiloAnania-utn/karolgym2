import { useEffect, useState } from "react";
import api from "../../api/client";

const CATEGORIES = ["Tecnica", "Movilidad", "CORE", "Running", "Caminatas", "Otros"];

export default function AdminFreeContentPage() {
  const [items, setItems] = useState([]);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  async function refresh() {
    const res = await api.get("/admin/contenido-gratis");
    setItems(res.data.items);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function create(data) {
    await api.post("/admin/contenido-gratis", data);
    setCreating(false);
    refresh();
  }

  async function update(id, data) {
    await api.put(`/admin/contenido-gratis/${id}`, data);
    setEditingId(null);
    refresh();
  }

  async function remove(id) {
    if (!confirm("¿Borrar este contenido?")) return;
    await api.delete(`/admin/contenido-gratis/${id}`);
    refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-extrabold text-3xl">Contenido gratis</h1>
        <button onClick={() => setCreating((v) => !v)} className="btn-primary">+ Agregar</button>
      </div>

      {creating && (
        <div className="card p-5 mb-6">
          <ItemForm onSave={create} onCancel={() => setCreating(false)} />
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) =>
          editingId === item.id ? (
            <div key={item.id} className="card p-5">
              <ItemForm initial={item} onSave={(data) => update(item.id, data)} onCancel={() => setEditingId(null)} />
            </div>
          ) : (
            <div key={item.id} className="card p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-cream-muted">{item.category} · {item.isPublished ? "Publicado" : "Borrador"}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditingId(item.id)} className="btn-ghost !px-3 !py-1.5 text-xs">Editar</button>
                <button onClick={() => remove(item.id)} className="btn-ghost !px-3 !py-1.5 text-xs text-coral">Borrar</button>
              </div>
            </div>
          )
        )}
        {items.length === 0 && <p className="text-cream-muted">Todavía no hay contenido gratuito cargado.</p>}
      </div>
    </div>
  );
}

function ItemForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    category: initial?.category || CATEGORIES[0],
    videoUrl: initial?.videoUrl || "",
    thumbnailUrl: initial?.thumbnailUrl || "",
    description: initial?.description || "",
    durationMinutes: initial?.durationMinutes || "",
    isPublished: initial?.isPublished ?? false,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      <input required className="input" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <input className="input" placeholder="URL del video" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
      <input className="input" placeholder="URL de miniatura" value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} />
      <textarea className="input" rows={2} placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input type="number" className="input" placeholder="Duración (min)" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="accent-coral" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
        Publicado
      </label>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary !py-2 text-sm">Guardar</button>
        <button type="button" onClick={onCancel} className="btn-ghost !py-2 text-sm">Cancelar</button>
      </div>
    </form>
  );
}
