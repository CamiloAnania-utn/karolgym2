const { Purchase, SubPack, UserPack } = require("../models");

// Flujo: elegir pack -> elegir version -> ver precio -> elegir metodo de pago -> confirmar.
exports.createPurchase = async (req, res) => {
  const { subPackId, paymentMethod } = req.body;
  if (!subPackId || !["mercado_pago", "transferencia"].includes(paymentMethod)) {
    return res.status(400).json({ error: "Datos de compra incompletos" });
  }
  const subPack = await SubPack.findByPk(subPackId);
  if (!subPack) return res.status(404).json({ error: "Pack no encontrado" });

  const purchase = await Purchase.create({
    userId: req.user.id,
    subPackId,
    amount: subPack.price,
    paymentMethod,
    // La transferencia queda pendiente de confirmacion manual; Mercado Pago se confirmaria via webhook (a integrar).
    status: "pendiente",
  });

  res.status(201).json({ purchase });
};

// El usuario marca "Ya realice la transferencia" y opcionalmente sube comprobante.
exports.markTransferSent = async (req, res) => {
  const { id } = req.params;
  const { transferProofUrl } = req.body;
  const purchase = await Purchase.findOne({ where: { id, userId: req.user.id } });
  if (!purchase) return res.status(404).json({ error: "No encontrada" });

  purchase.transferProofUrl = transferProofUrl || purchase.transferProofUrl;
  await purchase.save();
  res.json({ purchase });
};

exports.myPurchases = async (req, res) => {
  const purchases = await Purchase.findAll({
    where: { userId: req.user.id },
    include: [{ model: SubPack, as: "subPack" }],
    order: [["createdAt", "DESC"]],
  });
  res.json({ purchases });
};
