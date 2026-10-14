import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import LevelBadge from "../../components/LevelBadge";

export default function MyPacksPage() {
  const [activePacks, setActivePacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/cuenta/packs-activos").then((res) => setActivePacks(res.data.activePacks)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-cream-muted">Cargando...</p>;

  if (activePacks.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="mb-4">Todavía no tenés packs activos.</p>
        <Link to="/packs" className="btn-primary">Ver packs</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activePacks.map((up) => (
        <div key={up.id} className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cream-muted uppercase">{up.subPack.pack.name}</p>
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                {up.subPack.name} <LevelBadge level={up.subPack.level} />
              </h3>
            </div>
            <Link to={`/sub-packs/${up.subPack.id}`} className="btn-secondary !px-4 !py-2">Ver rutinas</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
