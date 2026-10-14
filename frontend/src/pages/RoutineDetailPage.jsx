import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";

export default function RoutineDetailPage() {
  const { id } = useParams();
  const [routine, setRoutine] = useState(null);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    api
      .get(`/packs/routines/${id}`)
      .then((res) => setRoutine(res.data.routine))
      .catch((err) => setError(err.response?.data?.error || "No se pudo cargar la rutina"));
  }, [id]);

  async function markComplete() {
    await api.post("/cuenta/historial", { routineId: id });
    setCompleted(true);
  }

  if (error) {
    return (
      <div className="section py-20 text-center">
        <p className="text-cream-muted">{error}</p>
        <Link to="/packs" className="btn-secondary mt-6 inline-flex">Ver packs</Link>
      </div>
    );
  }
  if (!routine) return <div className="section py-20 text-cream-muted">Cargando...</div>;

  return (
    <div className="section py-10 lg:py-14 max-w-3xl">
      <Link to={`/sub-packs/${routine.subPack.id}`} className="text-sm text-cream-muted hover:text-cream">
        ← {routine.subPack.pack.name} · {routine.subPack.name}
      </Link>

      <h1 className="font-display font-extrabold text-3xl sm:text-4xl mt-4">{routine.title}</h1>

      <div className="aspect-video bg-ink-surface border border-ink-line mt-6 flex items-center justify-center">
        {started ? (
          <video src={routine.videoUrl} controls autoPlay className="w-full h-full" />
        ) : (
          <button onClick={() => setStarted(true)} className="btn-primary">
            ▶ Comenzar entrenamiento
          </button>
        )}
      </div>

      {routine.description && <p className="text-cream-muted mt-6 leading-relaxed">{routine.description}</p>}

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {routine.durationMinutes && (
          <div className="card p-4">
            <dt className="text-xs text-cream-muted uppercase">Duración</dt>
            <dd className="font-display font-bold mt-1">{routine.durationMinutes} min</dd>
          </div>
        )}
        {routine.equipment && (
          <div className="card p-4">
            <dt className="text-xs text-cream-muted uppercase">Elementos</dt>
            <dd className="font-display font-bold mt-1">{routine.equipment}</dd>
          </div>
        )}
        {routine.level && (
          <div className="card p-4">
            <dt className="text-xs text-cream-muted uppercase">Nivel</dt>
            <dd className="font-display font-bold mt-1">{routine.level}</dd>
          </div>
        )}
        {routine.objective && (
          <div className="card p-4">
            <dt className="text-xs text-cream-muted uppercase">Objetivo</dt>
            <dd className="font-display font-bold mt-1">{routine.objective}</dd>
          </div>
        )}
      </dl>

      <div className="mt-8">
        {completed ? (
          <div className="card p-5 border-moss/50 bg-moss/5">
            <p className="font-display font-bold text-moss">¡Entrenamiento completado! 🔥</p>
            <p className="text-sm text-cream-muted mt-1">Quedó guardado en tu historial.</p>
            <Link to="/cuenta/checks" className="btn-secondary mt-4 inline-flex">Compartir un check</Link>
          </div>
        ) : (
          <button onClick={markComplete} className="btn-primary">
            Marcar como completado
          </button>
        )}
      </div>
    </div>
  );
}
