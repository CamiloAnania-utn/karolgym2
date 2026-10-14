const LABELS = { inicial: "Inicial", intermedio: "Intermedio", avanzado: "Avanzado" };

export default function LevelBadge({ level }) {
  if (!level) return null;
  return (
    <span className="badge border-cream/20 text-cream-muted uppercase">
      {LABELS[level] || level}
    </span>
  );
}
