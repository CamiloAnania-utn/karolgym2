import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import PackCard from "../components/PackCard";
import FreeContentCard from "../components/FreeContentCard";

export default function HomePage() {
  const [packs, setPacks] = useState([]);
  const [freeContent, setFreeContent] = useState([]);

  useEffect(() => {
    api.get("/packs").then((res) => setPacks(res.data.packs.slice(0, 3)));
    api.get("/contenido-gratis").then((res) => setFreeContent(res.data.items.slice(0, 4)));
  }, []);

  return (
    <div>
      {/* Hero: primero explicamos que es KAROLGYM, no pedimos login */}
      <section className="section pt-14 pb-16 lg:pt-24 lg:pb-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <span className="badge border-coral/40 text-coral mb-6">Entrenamiento personal, a tu ritmo</span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            Tu espacio para entrenar,
            <br />
            no solo otra biblioteca de videos.
          </h1>
          <p className="text-cream-muted text-lg mt-6 max-w-xl">
            Rutinas completas en video, packs organizados por nivel, tu propio calendario
            de entrenamiento y un lugar para ver cuánto avanzaste. Explorá primero, decidí después.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/gratis" className="btn-primary">
              Ver contenido gratis
            </Link>
            <Link to="/packs" className="btn-secondary">
              Conocer los packs
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card p-6 col-span-2">
            <p className="font-display font-bold text-3xl text-coral">+10</p>
            <p className="text-sm text-cream-muted mt-1">rutinas y clases gratuitas para arrancar hoy</p>
          </div>
          <div className="card p-6">
            <p className="font-display font-bold text-3xl">Packs</p>
            <p className="text-sm text-cream-muted mt-1">por nivel y objetivo</p>
          </div>
          <div className="card p-6">
            <p className="font-display font-bold text-3xl">1:1</p>
            <p className="text-sm text-cream-muted mt-1">planes personalizados</p>
          </div>
        </div>
      </section>

      {/* Contenido gratuito */}
      {freeContent.length > 0 && (
        <section className="section py-14 border-t border-ink-line">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl">Empezá sin pagar nada</h2>
              <p className="text-cream-muted mt-2">Técnica, movilidad y activación para entender cómo entrenamos acá.</p>
            </div>
            <Link to="/gratis" className="btn-ghost hidden sm:inline-flex">Ver todo →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {freeContent.map((item) => (
              <FreeContentCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Packs destacados */}
      {packs.length > 0 && (
        <section className="section py-14 border-t border-ink-line">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl">Packs de entrenamiento</h2>
              <p className="text-cream-muted mt-2">Cada versión tiene su propio nivel, duración y precio.</p>
            </div>
            <Link to="/packs" className="btn-ghost hidden sm:inline-flex">Ver todos →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packs.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </section>
      )}

      {/* El mapa del flujo, que sí es una secuencia real */}
      <section className="section py-16 border-t border-ink-line">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-10">Cómo funciona</h2>
        <ol className="grid sm:grid-cols-4 gap-6">
          {[
            ["Descubrí", "Explorá contenido gratis y packs sin necesidad de crear una cuenta."],
            ["Elegí", "Encontrá el pack y la versión que se ajusta a tu nivel y objetivo."],
            ["Entrená", "Seguí tus rutinas en video, a tu ritmo, cuando quieras."],
            ["Progresá", "Mirá tu historial, tus caminatas y lo que ya lograste."],
          ].map(([title, desc], i) => (
            <li key={title} className="border-t-2 border-coral pt-4">
              <span className="text-coral font-display font-bold text-sm">0{i + 1}</span>
              <h3 className="font-display font-bold text-lg mt-2">{title}</h3>
              <p className="text-sm text-cream-muted mt-2">{desc}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
