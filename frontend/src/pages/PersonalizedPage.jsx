import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function PersonalizedPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ objetivo: "", nivel: "", diasDisponibles: "", lesiones: "", comentarios: "" });
  const [requests, setRequests] = useState([]);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) api.get("/personalizados/mias").then((res) => setRequests(res.data.requests));
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/personalizados", { formData: form });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo enviar la solicitud");
    }
  }

  const pending = requests.find((r) => r.status === "pendiente");

  return (
    <div className="section py-10 lg:py-14 max-w-xl">
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl">Plan personalizado 1:1</h1>
      <p className="text-cream-muted mt-3">
        Contanos tu objetivo y tu disponibilidad. Karol revisa tu solicitud y te arma un plan a medida.
      </p>

      {!user && (
        <div className="card p-6 mt-8">
          <p className="mb-4">Necesitás una cuenta para solicitar un plan personalizado.</p>
          <Link to="/ingresar" state={{ from: "/personalizados" }} className="btn-primary">
            Iniciar sesión
          </Link>
        </div>
      )}

      {user && (sent || pending) && (
        <div className="card p-6 mt-8 border-moss/50 bg-moss/5">
          <p className="font-display font-bold text-moss">Tu solicitud está en revisión</p>
          <p className="text-sm text-cream-muted mt-1">Te avisamos apenas Karol la revise.</p>
        </div>
      )}

      {user && !sent && !pending && (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="label">¿Cuál es tu objetivo principal?</label>
            <input required className="input" value={form.objetivo} onChange={(e) => setForm({ ...form, objetivo: e.target.value })} />
          </div>
          <div>
            <label className="label">Nivel actual</label>
            <select required className="input" value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })}>
              <option value="">Elegí una opción</option>
              <option value="inicial">Inicial</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
          <div>
            <label className="label">Días disponibles por semana</label>
            <input required className="input" value={form.diasDisponibles} onChange={(e) => setForm({ ...form, diasDisponibles: e.target.value })} />
          </div>
          <div>
            <label className="label">¿Alguna lesión o molestia a tener en cuenta?</label>
            <textarea className="input" rows={3} value={form.lesiones} onChange={(e) => setForm({ ...form, lesiones: e.target.value })} />
          </div>
          <div>
            <label className="label">Comentarios adicionales</label>
            <textarea className="input" rows={3} value={form.comentarios} onChange={(e) => setForm({ ...form, comentarios: e.target.value })} />
          </div>
          {error && <p className="text-coral text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full">Enviar solicitud</button>
        </form>
      )}
    </div>
  );
}
