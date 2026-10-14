import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import SubPackOption from "../components/SubPackOption";

export default function PackDetailPage() {
  const { slug } = useParams();
  const [pack, setPack] = useState(null);

  useEffect(() => {
    api.get(`/packs/${slug}`).then((res) => setPack(res.data.pack));
  }, [slug]);

  if (!pack) return <div className="section py-20 text-cream-muted">Cargando...</div>;

  return (
    <div className="section py-10 lg:py-14 max-w-3xl">
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl">{pack.name}</h1>
      {pack.description && <p className="text-cream-muted mt-3">{pack.description}</p>}

      <h2 className="font-display font-bold text-xl mt-10 mb-4">Elegí tu versión</h2>
      <div className="grid gap-4">
        {pack.subPacks.map((sp) => (
          <SubPackOption key={sp.id} subPack={sp} />
        ))}
        {pack.subPacks.length === 0 && <p className="text-cream-muted">Todavía no hay versiones publicadas de este pack.</p>}
      </div>
    </div>
  );
}
