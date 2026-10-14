import { useEffect, useState } from "react";
import api from "../api/client";
import FreeContentCard from "../components/FreeContentCard";

export default function FreeContentListPage() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    api.get("/contenido-gratis", { params: category ? { category } : {} }).then((res) => setItems(res.data.items));
  }, [category]);

  const categories = ["Tecnica", "Movilidad", "CORE", "Running", "Caminatas"];

  return (
    <div className="section py-10 lg:py-14">
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl">Contenido gratuito</h1>
      <p className="text-cream-muted mt-3 max-w-xl">
        Explorá sin cuenta. Para reproducir un video necesitás iniciar sesión — así podemos guardar tu progreso.
      </p>

      <div className="flex flex-wrap gap-2 mt-8">
        <button
          onClick={() => setCategory("")}
          className={`badge border-cream/20 ${!category ? "bg-coral text-ink border-coral" : "text-cream-muted"}`}
        >
          Todo
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`badge border-cream/20 ${category === c ? "bg-coral text-ink border-coral" : "text-cream-muted"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
        {items.map((item) => (
          <FreeContentCard key={item.id} item={item} />
        ))}
        {items.length === 0 && <p className="text-cream-muted col-span-full py-10">Todavía no hay contenido en esta categoría.</p>}
      </div>
    </div>
  );
}
