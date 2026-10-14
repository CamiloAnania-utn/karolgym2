import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import PriceTag from "../components/PriceTag";
import LevelBadge from "../components/LevelBadge";
import RoutineRow from "../components/RoutineRow";

export default function SubPackDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [subPack, setSubPack] = useState(null);
  const [owned, setOwned] = useState(false);

  useEffect(() => {
    api.get(`/packs/sub-packs/${id}`).then((res) => {
      setSubPack(res.data.subPack);
      setOwned(res.data.owned);
    });
  }, [id]);

  if (!subPack) return <div className="section py-20 text-cream-muted">Cargando...</div>;

  return (
    <div className="section py-10 lg:py-14 max-w-3xl">
      <Link to={`/packs/${subPack.pack.slug}`} className="text-sm text-cream-muted hover:text-cream">
        ← {subPack.pack.name}
      </Link>

      <div className="flex items-center gap-2 mt-4 mb-2">
        <LevelBadge level={subPack.level} />
        <span className="badge border-cream/20 text-cream-muted">{subPack.daysPerWeek} días/semana</span>
      </div>
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl">{subPack.name}</h1>
      {subPack.description && <p className="text-cream-muted mt-3">{subPack.description}</p>}

      <div className="flex items-center justify-between card p-5 mt-6">
        <div>
          <p className="text-xs text-cream-muted uppercase tracking-wide">Precio</p>
          <PriceTag amount={subPack.price} />
        </div>
        {owned ? (
          <span className="badge border-moss text-moss">Ya tenés este pack</span>
        ) : user ? (
          <Link to={`/checkout/${subPack.id}`} className="btn-primary">
            Comprar
          </Link>
        ) : (
          <Link to="/ingresar" state={{ from: `/sub-packs/${id}` }} className="btn-primary">
            Iniciar sesión para comprar
          </Link>
        )}
      </div>

      <h2 className="font-display font-bold text-xl mt-10 mb-4">Rutinas</h2>
      <div className="grid gap-3">
        {subPack.routines.map((routine) => (
          <RoutineRow key={routine.id} routine={routine} locked={!owned} />
        ))}
        {subPack.routines.length === 0 && <p className="text-cream-muted">Todavía no hay rutinas cargadas.</p>}
      </div>
    </div>
  );
}
