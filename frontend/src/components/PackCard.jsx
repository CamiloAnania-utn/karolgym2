import { Link } from "react-router-dom";

export default function PackCard({ pack }) {
  const fromPrice = pack.subPacks?.length
    ? Math.min(...pack.subPacks.map((sp) => Number(sp.price)))
    : null;

  return (
    <Link to={`/packs/${pack.slug}`} className="card group block overflow-hidden hover:border-coral/60 transition-colors">
      <div className="aspect-[4/3] bg-ink-raised flex items-center justify-center text-cream-muted text-xs">
        {pack.coverImageUrl ? (
          <img src={pack.coverImageUrl} alt={pack.name} className="w-full h-full object-cover" />
        ) : (
          "KAROLGYM"
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-xl group-hover:text-coral transition-colors">{pack.name}</h3>
        {pack.description && <p className="text-sm text-cream-muted mt-2 line-clamp-2">{pack.description}</p>}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-cream-muted">{pack.subPacks?.length || 0} versiones</span>
          {fromPrice !== null && (
            <span className="text-sm text-gold font-bold">
              Desde {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(fromPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
