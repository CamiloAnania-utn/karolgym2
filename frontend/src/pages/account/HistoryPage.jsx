import { useEffect, useState } from "react";
import api from "../../api/client";

export default function HistoryPage() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    api.get("/cuenta/historial").then((res) => setCompleted(res.data.completed));
  }, []);

  if (completed.length === 0) return <p className="text-cream-muted">Todavía no completaste ningún entrenamiento. ¡Vamos que arrancamos!</p>;

  const streak = computeWeekStreak(completed.map((c) => c.completedAt));

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <p className="font-display font-bold text-3xl text-coral">{completed.length}</p>
          <p className="text-sm text-cream-muted mt-1">entrenamientos completados</p>
        </div>
        <div className="card p-5">
          <p className="font-display font-bold text-3xl text-coral">{streak}</p>
          <p className="text-sm text-cream-muted mt-1">semanas consecutivas</p>
        </div>
      </div>

      <h3 className="font-display font-bold text-lg mb-3">Mirá todo lo que hiciste</h3>
      <div className="space-y-2">
        {completed.map((c) => (
          <div key={c.id} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{c.routine?.title}</p>
              <p className="text-xs text-cream-muted">{c.routine?.subPack?.name}</p>
            </div>
            <p className="text-xs text-cream-muted">{new Date(c.completedAt).toLocaleDateString("es-AR")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function computeWeekStreak(dates) {
  if (dates.length === 0) return 0;
  const weeks = new Set(
    dates.map((d) => {
      const date = new Date(d);
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const week = Math.ceil(((date - firstDayOfYear) / 86400000 + firstDayOfYear.getDay() + 1) / 7);
      return `${date.getFullYear()}-${week}`;
    })
  );
  return weeks.size;
}
