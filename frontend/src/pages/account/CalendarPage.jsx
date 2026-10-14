import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

// Primera version: combina todos los packs activos en un unico calendario semanal.
// La asignacion automatica dia-por-dia es una de las decisiones pendientes del documento base;
// por ahora mostramos las rutinas de cada pack activo en orden, listas para entrenar cuando quieras.
export default function CalendarPage() {
  const [activePacks, setActivePacks] = useState([]);

  useEffect(() => {
    api.get("/cuenta/packs-activos").then((res) => setActivePacks(res.data.activePacks));
  }, []);

  if (activePacks.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="mb-4">Activá un pack para armar tu calendario de entrenamiento.</p>
        <Link to="/packs" className="btn-primary">Ver packs</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-cream-muted text-sm">
        Esta semana tenés {activePacks.reduce((n, up) => n + (up.subPack.routines?.length || 0), 0)} rutinas disponibles entre todos tus packs activos.
      </p>
      {activePacks.map((up) => (
        <div key={up.id}>
          <h3 className="font-display font-bold text-lg mb-3">{up.subPack.pack.name} — {up.subPack.name}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {up.subPack.routines?.map((r) => (
              <Link key={r.id} to={`/rutinas/${r.id}`} className="card p-4 hover:border-coral/60 transition-colors">
                <p className="font-semibold">{r.title}</p>
                <p className="text-xs text-cream-muted mt-1">{r.durationMinutes ? `${r.durationMinutes} min` : ""}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
