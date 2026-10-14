import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

export default function FavoritesPage() {
  const [freeContents, setFreeContents] = useState([]);
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    api.get("/cuenta/favoritos").then((res) => {
      setFreeContents(res.data.freeContents);
      setRoutines(res.data.routines);
    });
  }, []);

  const isEmpty = freeContents.length === 0 && routines.length === 0;

  if (isEmpty) return <p className="text-cream-muted">Todavía no guardaste nada en favoritos.</p>;

  return (
    <div className="space-y-8">
      {freeContents.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-lg mb-3">Contenido gratis</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {freeContents.map((item) => (
              <Link key={item.id} to={`/gratis/${item.id}`} className="card p-4 hover:border-coral/60 transition-colors">
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-cream-muted mt-1">{item.category}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
      {routines.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-lg mb-3">Rutinas</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {routines.map((r) => (
              <Link key={r.id} to={`/rutinas/${r.id}`} className="card p-4 hover:border-coral/60 transition-colors">
                <p className="font-semibold">{r.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
