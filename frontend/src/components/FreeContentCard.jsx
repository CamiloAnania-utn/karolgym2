import { Link } from "react-router-dom";

export default function FreeContentCard({ item }) {
  return (
    <Link to={`/gratis/${item.id}`} className="card group block overflow-hidden hover:border-coral/60 transition-colors">
      <div className="aspect-video bg-ink-raised flex items-center justify-center text-cream-muted text-xs">
        {item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          "KAROLGYM"
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold text-coral uppercase tracking-wide">{item.category}</span>
        <h3 className="font-display font-bold text-lg mt-1 group-hover:text-coral transition-colors">{item.title}</h3>
        {item.durationMinutes && <p className="text-sm text-cream-muted mt-1">{item.durationMinutes} min</p>}
      </div>
    </Link>
  );
}
