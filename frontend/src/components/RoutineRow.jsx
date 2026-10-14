import { Link } from "react-router-dom";

export default function RoutineRow({ routine, locked }) {
  return (
    <Link
      to={locked ? "#" : `/rutinas/${routine.id}`}
      onClick={(e) => locked && e.preventDefault()}
      className={`card flex items-center justify-between gap-4 p-4 transition-colors ${
        locked ? "opacity-60 cursor-not-allowed" : "hover:border-coral/60"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-ink-line text-coral font-display font-bold">
          {locked ? "🔒" : "▶"}
        </div>
        <div>
          <h4 className="font-display font-bold">{routine.title}</h4>
          <p className="text-xs text-cream-muted">
            {routine.durationMinutes ? `${routine.durationMinutes} min` : ""}
            {routine.equipment ? ` · ${routine.equipment}` : ""}
          </p>
        </div>
      </div>
    </Link>
  );
}
