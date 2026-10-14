import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import PriceTag from "../components/PriceTag";

const ALIAS = "KAROLGYM.MP";

export default function CheckoutPage() {
  const { subPackId } = useParams();
  const navigate = useNavigate();
  const [subPack, setSubPack] = useState(null);
  const [method, setMethod] = useState(null);
  const [purchase, setPurchase] = useState(null);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    api.get(`/packs/sub-packs/${subPackId}`).then((res) => setSubPack(res.data.subPack));
  }, [subPackId]);

  async function choosePaymentMethod(paymentMethod) {
    setMethod(paymentMethod);
    const res = await api.post("/compras", { subPackId, paymentMethod });
    setPurchase(res.data.purchase);
  }

  async function confirmTransferSent() {
    await api.post(`/compras/${purchase.id}/transferencia-enviada`, {});
    setSent(true);
  }

  function copy(text, label) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  }

  if (!subPack) return <div className="section py-20 text-cream-muted">Cargando...</div>;

  if (sent) {
    return (
      <div className="section py-20 max-w-lg text-center">
        <div className="card p-8 border-moss/50 bg-moss/5">
          <h1 className="font-display font-extrabold text-2xl text-moss">¡Listo, recibimos tu aviso!</h1>
          <p className="text-cream-muted mt-3">
            En cuanto confirmemos la transferencia vas a ver <strong className="text-cream">{subPack.name}</strong> activo en tu cuenta.
          </p>
          <button onClick={() => navigate("/cuenta/packs")} className="btn-primary mt-6">
            Ir a mis packs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section py-10 lg:py-14 max-w-lg">
      <h1 className="font-display font-extrabold text-3xl">Finalizar compra</h1>

      <div className="card p-5 mt-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-cream-muted uppercase">{subPack.pack.name}</p>
          <p className="font-display font-bold text-lg">{subPack.name}</p>
        </div>
        <PriceTag amount={subPack.price} />
      </div>

      {!method && (
        <div className="grid gap-3 mt-8">
          <p className="label">Elegí cómo pagar</p>
          <button onClick={() => choosePaymentMethod("mercado_pago")} className="card p-5 text-left hover:border-coral/60 transition-colors">
            <p className="font-display font-bold">Mercado Pago</p>
            <p className="text-sm text-cream-muted mt-1">Pago online, acreditación automática.</p>
          </button>
          <button onClick={() => choosePaymentMethod("transferencia")} className="card p-5 text-left hover:border-coral/60 transition-colors">
            <p className="font-display font-bold">Transferencia bancaria</p>
            <p className="text-sm text-cream-muted mt-1">Transferís y confirmamos tu pago manualmente.</p>
          </button>
        </div>
      )}

      {method === "mercado_pago" && purchase && (
        <div className="card p-6 mt-8 text-center">
          <p className="text-cream-muted">
            Acá se integraría el checkout de Mercado Pago (Checkout Pro / API de pagos) para esta compra
            <code className="text-xs block mt-2 text-cream-muted/70">#{purchase.id}</code>.
          </p>
        </div>
      )}

      {method === "transferencia" && purchase && (
        <div className="card p-6 mt-8">
          <p className="font-display font-bold mb-4">Datos para transferir</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-ink-raised px-4 py-3">
              <div>
                <p className="text-xs text-cream-muted">Alias</p>
                <p className="font-semibold">{ALIAS}</p>
              </div>
              <button onClick={() => copy(ALIAS, "alias")} className="btn-ghost !px-3 !py-1.5 text-xs">
                {copied === "alias" ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
            <div className="flex items-center justify-between bg-ink-raised px-4 py-3">
              <div>
                <p className="text-xs text-cream-muted">Monto</p>
                <p className="font-semibold">
                  {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(subPack.price)}
                </p>
              </div>
              <button onClick={() => copy(String(subPack.price), "monto")} className="btn-ghost !px-3 !py-1.5 text-xs">
                {copied === "monto" ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
          <button onClick={confirmTransferSent} className="btn-primary w-full mt-6">
            Ya realicé la transferencia
          </button>
        </div>
      )}
    </div>
  );
}
