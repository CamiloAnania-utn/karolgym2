import { useEffect, useState } from "react";
import api from "../../api/client";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/estadisticas").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p className="text-cream-muted">Cargando...</p>;

  const cards = [
    ["Usuarios", stats.totalUsers],
    ["Compras confirmadas", stats.totalPurchasesConfirmed],
    ["Ingresos totales", new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(stats.totalRevenue)],
    ["Favoritos guardados", stats.totalFavorites],
    ["Entrenamientos completados", stats.totalCompletedWorkouts],
  ];

  return (
    <div>
      <h1 className="font-display font-extrabold text-3xl mb-8">Estadísticas</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(([label, value]) => (
          <div key={label} className="card p-6">
            <p className="font-display font-bold text-3xl text-coral">{value}</p>
            <p className="text-sm text-cream-muted mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
