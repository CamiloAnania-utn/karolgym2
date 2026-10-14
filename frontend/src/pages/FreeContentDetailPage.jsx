import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function FreeContentDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [savedFav, setSavedFav] = useState(false);

  useEffect(() => {
    api.get(`/contenido-gratis/${id}`).then((res) => {
      setItem(res.data.item);
      setRequiresLogin(res.data.requiresLogin);
    });
  }, [id]);

  async function toggleFavorite() {
    if (!user) return;
    await api.post("/cuenta/favoritos", { contentType: "free_content", contentId: id });
    setSavedFav(true);
  }

  if (!item) return <div className="section py-20 text-cream-muted">Cargando...</div>;

  return (
    <div className="section py-10 lg:py-14 max-w-3xl">
      <span className="text-xs font-semibold text-coral uppercase tracking-wide">{item.category}</span>
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl mt-2">{item.title}</h1>
      {item.durationMinutes && <p className="text-cream-muted mt-2">{item.durationMinutes} min</p>}

      <div className="aspect-video bg-ink-surface border border-ink-line mt-6 flex items-center justify-center">
        {requiresLogin ? (
          <div className="text-center px-6">
            <p className="font-display font-bold text-xl mb-2">Iniciá sesión para reproducir este video</p>
            <p className="text-cream-muted text-sm mb-6">Es gratis — solo necesitamos saber quién lo está mirando.</p>
            <div className="flex justify-center gap-3">
              <Link to="/ingresar" state={{ from: `/gratis/${id}` }} className="btn-primary">
                Iniciar sesión
              </Link>
              <Link to="/crear-cuenta" state={{ from: `/gratis/${id}` }} className="btn-secondary">
                Crear cuenta
              </Link>
            </div>
          </div>
        ) : (
          <video src={item.videoUrl} controls className="w-full h-full" />
        )}
      </div>

      {item.description && <p className="text-cream-muted mt-6 leading-relaxed">{item.description}</p>}

      {user && (
        <button onClick={toggleFavorite} className="btn-secondary mt-6" disabled={savedFav}>
          {savedFav ? "Guardado en favoritos ❤️" : "Guardar en favoritos"}
        </button>
      )}
    </div>
  );
}
