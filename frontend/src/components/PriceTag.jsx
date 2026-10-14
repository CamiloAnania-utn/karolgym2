export default function PriceTag({ amount }) {
  const formatted = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
  return <span className="font-display font-bold text-gold">{formatted}</span>;
}
