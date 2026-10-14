import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [notif, setNotif] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/cuenta/perfil").then((res) => {
      setForm({ name: res.data.user.name, phone: res.data.user.phone || "" });
      setNotif(res.data.notificationSetting);
    });
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    const res = await api.put("/cuenta/perfil", form);
    setUser((u) => ({ ...u, ...res.data.user }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  async function saveNotif(field, value) {
    const updated = { ...notif, [field]: value };
    setNotif(updated);
    await api.put("/cuenta/notificaciones", updated);
  }

  return (
    <div className="max-w-lg space-y-10">
      <section>
        <h2 className="font-display font-bold text-xl mb-4">Perfil</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary">{saved ? "Guardado ✓" : "Guardar cambios"}</button>
        </form>
      </section>

      {notif && (
        <section>
          <h2 className="font-display font-bold text-xl mb-4">Recordatorios</h2>
          <div className="space-y-3">
            <label className="card p-4 flex items-center justify-between cursor-pointer">
              <span>
                <span className="block font-semibold">La noche anterior</span>
                <span className="block text-xs text-cream-muted">"Mañana entrenás 💪"</span>
              </span>
              <input
                type="checkbox"
                checked={notif.nightBeforeReminder}
                onChange={(e) => saveNotif("nightBeforeReminder", e.target.checked)}
                className="w-5 h-5 accent-coral"
              />
            </label>
            <label className="card p-4 flex items-center justify-between cursor-pointer">
              <span>
                <span className="block font-semibold">El mismo día</span>
                <span className="block text-xs text-cream-muted">"Hoy toca entrenar 🧡"</span>
              </span>
              <input
                type="checkbox"
                checked={notif.sameDayReminder}
                onChange={(e) => saveNotif("sameDayReminder", e.target.checked)}
                className="w-5 h-5 accent-coral"
              />
            </label>
          </div>
        </section>
      )}
    </div>
  );
}
