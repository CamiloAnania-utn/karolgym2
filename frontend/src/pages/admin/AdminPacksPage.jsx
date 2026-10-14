import { useEffect, useState } from "react";
import api from "../../api/client";

export default function AdminPacksPage() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingPack, setCreatingPack] = useState(false);
  const [expanded, setExpanded] = useState({}); // packId -> bool

  async function refresh() {
    const res = await api.get("/admin/packs");
    setPacks(res.data.packs);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  function toggleExpand(id) {
    setExpanded((e) => ({ ...e, [id]: !e[id] }));
  }

  async function savePack(data, id) {
    if (id) await api.put(`/admin/packs/${id}`, data);
    else await api.post("/admin/packs", data);
    setCreatingPack(false);
    refresh();
  }

  async function deletePack(id) {
    if (!confirm("¿Borrar esta carpeta y todo lo que tiene adentro?")) return;
    await api.delete(`/admin/packs/${id}`);
    refresh();
  }

  if (loading) return <p className="text-cream-muted">Cargando...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-extrabold text-3xl">Packs de entrenamiento</h1>
        <button onClick={() => setCreatingPack((v) => !v)} className="btn-primary">
          + Crear carpeta
        </button>
      </div>

      {creatingPack && (
        <div className="card p-5 mb-6">
          <PackForm onSave={(data) => savePack(data)} onCancel={() => setCreatingPack(false)} />
        </div>
      )}

      <div className="space-y-4">
        {packs.map((pack) => (
          <PackRow
            key={pack.id}
            pack={pack}
            expanded={!!expanded[pack.id]}
            onToggle={() => toggleExpand(pack.id)}
            onSave={(data) => savePack(data, pack.id)}
            onDelete={() => deletePack(pack.id)}
            onRefresh={refresh}
          />
        ))}
        {packs.length === 0 && <p className="text-cream-muted">Todavía no creaste ninguna carpeta.</p>}
      </div>
    </div>
  );
}

function PackRow({ pack, expanded, onToggle, onSave, onDelete, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [creatingSubPack, setCreatingSubPack] = useState(false);

  async function saveSubPack(data) {
    await api.post("/admin/sub-packs", { ...data, packId: pack.id });
    setCreatingSubPack(false);
    onRefresh();
  }

  if (editing) {
    return (
      <div className="card p-5">
        <PackForm initial={pack} onSave={(data) => { onSave(data); setEditing(false); }} onCancel={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-5 flex items-center justify-between gap-4">
        <button onClick={onToggle} className="flex items-center gap-3 text-left flex-1">
          <span className="text-coral font-display font-bold">{expanded ? "−" : "+"}</span>
          <div>
            <h3 className="font-display font-bold text-lg">{pack.name}</h3>
            <p className="text-xs text-cream-muted">{pack.subPacks?.length || 0} versiones · {pack.isPublished ? "Publicado" : "Borrador"}</p>
          </div>
        </button>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setEditing(true)} className="btn-ghost !px-3 !py-1.5 text-xs">Editar</button>
          <button onClick={onDelete} className="btn-ghost !px-3 !py-1.5 text-xs text-coral">Borrar</button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-ink-line p-5 space-y-4">
          {pack.subPacks?.map((sp) => (
            <SubPackRow key={sp.id} subPack={sp} onRefresh={onRefresh} />
          ))}

          {creatingSubPack ? (
            <SubPackForm onSave={saveSubPack} onCancel={() => setCreatingSubPack(false)} />
          ) : (
            <button onClick={() => setCreatingSubPack(true)} className="btn-secondary !py-2 text-sm">
              + Agregar versión (subpack)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SubPackRow({ subPack, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [creatingRoutine, setCreatingRoutine] = useState(false);

  async function save(data) {
    await api.put(`/admin/sub-packs/${subPack.id}`, data);
    setEditing(false);
    onRefresh();
  }

  async function remove() {
    if (!confirm("¿Borrar esta versión y sus rutinas?")) return;
    await api.delete(`/admin/sub-packs/${subPack.id}`);
    onRefresh();
  }

  async function saveRoutine(data) {
    await api.post("/admin/rutinas", { ...data, subPackId: subPack.id });
    setCreatingRoutine(false);
    onRefresh();
  }

  if (editing) {
    return (
      <div className="bg-ink-raised p-4">
        <SubPackForm initial={subPack} onSave={save} onCancel={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="bg-ink-raised">
      <div className="p-4 flex items-center justify-between gap-4">
        <button onClick={() => setExpanded((v) => !v)} className="flex items-center gap-3 text-left flex-1">
          <span className="text-coral font-display font-bold text-sm">{expanded ? "−" : "+"}</span>
          <div>
            <p className="font-semibold">{subPack.name}</p>
            <p className="text-xs text-cream-muted">
              {subPack.level} · {subPack.daysPerWeek} días/sem · ${subPack.price} · {subPack.routines?.length || 0} rutinas ·{" "}
              {subPack.isPublished ? "Publicado" : "Borrador"}
            </p>
          </div>
        </button>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setEditing(true)} className="btn-ghost !px-3 !py-1.5 text-xs">Editar</button>
          <button onClick={remove} className="btn-ghost !px-3 !py-1.5 text-xs text-coral">Borrar</button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-ink-line p-4 space-y-3">
          {subPack.routines?.map((r) => (
            <RoutineRowAdmin key={r.id} routine={r} onRefresh={onRefresh} />
          ))}
          {creatingRoutine ? (
            <RoutineForm onSave={saveRoutine} onCancel={() => setCreatingRoutine(false)} />
          ) : (
            <button onClick={() => setCreatingRoutine(true)} className="btn-ghost !py-2 text-sm">
              + Agregar rutina (día)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function RoutineRowAdmin({ routine, onRefresh }) {
  const [editing, setEditing] = useState(false);

  async function save(data) {
    await api.put(`/admin/rutinas/${routine.id}`, data);
    setEditing(false);
    onRefresh();
  }
  async function remove() {
    if (!confirm("¿Borrar esta rutina?")) return;
    await api.delete(`/admin/rutinas/${routine.id}`);
    onRefresh();
  }

  if (editing) return <RoutineForm initial={routine} onSave={save} onCancel={() => setEditing(false)} />;

  return (
    <div className="flex items-center justify-between gap-4 bg-ink px-4 py-3">
      <div>
        <p className="font-semibold text-sm">{routine.title}</p>
        <p className="text-xs text-cream-muted">{routine.durationMinutes ? `${routine.durationMinutes} min` : "Sin duración"} {routine.videoUrl ? "· video cargado" : "· sin video"}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={() => setEditing(true)} className="btn-ghost !px-3 !py-1 text-xs">Editar</button>
        <button onClick={remove} className="btn-ghost !px-3 !py-1 text-xs text-coral">Borrar</button>
      </div>
    </div>
  );
}

// ---- Formularios ----

function PackForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    coverImageUrl: initial?.coverImageUrl || "",
    isPublished: initial?.isPublished ?? false,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      <input required className="input" placeholder="Nombre (ej: Full Body Fem)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <textarea className="input" rows={2} placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input className="input" placeholder="URL de imagen de portada" value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="accent-coral" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
        Publicado (visible para usuarios)
      </label>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary !py-2 text-sm">Guardar</button>
        <button type="button" onClick={onCancel} className="btn-ghost !py-2 text-sm">Cancelar</button>
      </div>
    </form>
  );
}

function SubPackForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    level: initial?.level || "inicial",
    daysPerWeek: initial?.daysPerWeek || 2,
    price: initial?.price || "",
    description: initial?.description || "",
    objective: initial?.objective || "",
    isPublished: initial?.isPublished ?? false,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      <input required className="input" placeholder="Nombre (ej: Inicial - 2 días)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
          <option value="inicial">Inicial</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
        </select>
        <input required type="number" min={1} className="input" placeholder="Días/semana" value={form.daysPerWeek} onChange={(e) => setForm({ ...form, daysPerWeek: Number(e.target.value) })} />
      </div>
      <input required type="number" step="0.01" className="input" placeholder="Precio" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <input className="input" placeholder="Objetivo (ej: Full Body / Fuerza)" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} />
      <textarea className="input" rows={2} placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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

function RoutineForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    videoUrl: initial?.videoUrl || "",
    description: initial?.description || "",
    durationMinutes: initial?.durationMinutes || "",
    equipment: initial?.equipment || "",
    level: initial?.level || "",
    objective: initial?.objective || "",
    categories: (initial?.categories || []).join(", "),
  });

  function submit(e) {
    e.preventDefault();
    onSave({ ...form, categories: form.categories.split(",").map((c) => c.trim()).filter(Boolean) });
  }

  return (
    <form onSubmit={submit} className="space-y-3 bg-ink p-4">
      <input required className="input" placeholder="Título (ej: Día 1)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input className="input" placeholder="URL del video" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
      <textarea className="input" rows={2} placeholder="Descripción de la clase" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <input type="number" className="input" placeholder="Duración (min)" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
        <input className="input" placeholder="Elementos (ej: Mancuernas)" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="Nivel" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
        <input className="input" placeholder="Objetivo" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} />
      </div>
      <input className="input" placeholder="Categorías separadas por coma" value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary !py-2 text-sm">Guardar</button>
        <button type="button" onClick={onCancel} className="btn-ghost !py-2 text-sm">Cancelar</button>
      </div>
    </form>
  );
}
