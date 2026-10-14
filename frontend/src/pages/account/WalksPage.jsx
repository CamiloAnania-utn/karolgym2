import { useEffect, useRef, useState } from "react";
import api from "../../api/client";

export default function WalksPage() {
  const [walks, setWalks] = useState([]);
  const [active, setActive] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    api.get("/caminatas").then((res) => setWalks(res.data.walks));
  }, []);

  useEffect(() => {
    if (active?.status === "en_curso") {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [active]);

  async function startWalk() {
    const res = await api.post("/caminatas", {});
    setActive(res.data.walk);
    setElapsed(0);
  }

  async function pauseResume() {
    const nextStatus = active.status === "en_curso" ? "pausada" : "en_curso";
    const res = await api.put(`/caminatas/${active.id}`, { status: nextStatus, durationSeconds: elapsed });
    setActive(res.data.walk);
  }

  async function finish() {
    // Valores de pasos/distancia simulados: en una app real vendrian del sensor de pasos / GPS del celular.
    const steps = Math.round(elapsed * 1.6);
    const distanceKm = +(steps * 0.0007).toFixed(2);
    const res = await api.put(`/caminatas/${active.id}`, { status: "finalizada", durationSeconds: elapsed, steps, distanceKm });
    setWalks((w) => [res.data.walk, ...w]);
    setActive(null);
  }

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="space-y-8">
      <div className="card p-8 text-center">
        {!active ? (
          <>
            <p className="text-cream-muted mb-4">Registrá tus caminatas: pasos, tiempo y distancia.</p>
            <button onClick={startWalk} className="btn-primary">CAMINAR</button>
          </>
        ) : (
          <>
            <p className="font-display font-extrabold text-5xl text-coral">{formatTime(elapsed)}</p>
            <p className="text-cream-muted text-sm mt-1 uppercase tracking-wide">
              {active.status === "en_curso" ? "En curso" : "Pausada"}
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={pauseResume} className="btn-secondary">
                {active.status === "en_curso" ? "⏸ Pausar" : "▶ Continuar"}
              </button>
              <button onClick={finish} className="btn-primary">⏹ Finalizar</button>
            </div>
          </>
        )}
      </div>

      <div>
        <h3 className="font-display font-bold text-lg mb-3">Historial de caminatas</h3>
        <div className="space-y-2">
          {walks.map((w) => (
            <div key={w.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{w.steps} pasos · {w.distanceKm} km</p>
                <p className="text-xs text-cream-muted">{new Date(w.startedAt).toLocaleDateString("es-AR")}</p>
              </div>
              <p className="text-xs text-cream-muted">{formatTime(w.durationSeconds)}</p>
            </div>
          ))}
          {walks.length === 0 && <p className="text-cream-muted text-sm">Todavía no registraste caminatas.</p>}
        </div>
      </div>
    </div>
  );
}
