import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="section py-24 text-center text-cream-muted">Cargando...</div>;
  if (!user) return <Navigate to="/ingresar" state={{ from: location }} replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="section py-24 text-center text-cream-muted">Cargando...</div>;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
