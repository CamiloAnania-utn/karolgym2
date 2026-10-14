import { useEffect, useState } from "react";
import api from "../api/client";
import PackCard from "../components/PackCard";

export default function PacksCatalogPage() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/packs").then((res) => setPacks(res.data.packs)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="section py-10 lg:py-14">
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl">Packs de entrenamiento</h1>
      <p className="text-cream-muted mt-3 max-w-xl">
        Elegí un pack y después la versión que se ajusta a tu nivel. El precio es por versión, no por el pack general.
      </p>

      {loading && <p className="text-cream-muted mt-10">Cargando...</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {packs.map((pack) => (
          <PackCard key={pack.id} pack={pack} />
        ))}
      </div>
      {!loading && packs.length === 0 && <p className="text-cream-muted mt-10">Todavía no hay packs publicados.</p>}
    </div>
  );
}
