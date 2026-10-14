import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="section py-24 text-center">
      <p className="font-display font-extrabold text-6xl text-coral">404</p>
      <p className="text-cream-muted mt-4">No encontramos esta página.</p>
      <Link to="/" className="btn-primary mt-8 inline-flex">Volver al inicio</Link>
    </div>
  );
}
