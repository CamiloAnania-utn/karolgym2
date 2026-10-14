import { Link } from "react-router-dom";
import PriceTag from "./PriceTag";
import LevelBadge from "./LevelBadge";

export default function SubPackOption({ subPack }) {
  return (
    <Link
      to={`/sub-packs/${subPack.id}`}
      className="card flex items-center justify-between gap-4 p-5 hover:border-coral/60 transition-colors"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <LevelBadge level={subPack.level} />
          <span className="badge border-cream/20 text-cream-muted">{subPack.daysPerWeek} días/semana</span>
        </div>
        <h4 className="font-display font-bold text-lg">{subPack.name}</h4>
      </div>
      <PriceTag amount={subPack.price} />
    </Link>
  );
}
