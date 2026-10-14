const { Pack, SubPack, Routine, UserPack } = require("../models");

// Catalogo publico: carpetas con sus subpacks (sin el detalle de rutinas).
exports.listPacks = async (req, res) => {
  const packs = await Pack.findAll({
    where: { isPublished: true },
    include: [{ model: SubPack, as: "subPacks", where: { isPublished: true }, required: false }],
    order: [["order", "ASC"], [{ model: SubPack, as: "subPacks" }, "order", "ASC"]],
  });
  res.json({ packs });
};

exports.getPackBySlug = async (req, res) => {
  const pack = await Pack.findOne({
    where: { slug: req.params.slug, isPublished: true },
    include: [{ model: SubPack, as: "subPacks", where: { isPublished: true }, required: false }],
    order: [[{ model: SubPack, as: "subPacks" }, "order", "ASC"]],
  });
  if (!pack) return res.status(404).json({ error: "Pack no encontrado" });
  res.json({ pack });
};

// Detalle de un subpack (producto comprable) con sus rutinas.
// Si el usuario ya lo tiene activo, se marca owned=true para que el front muestre los videos.
exports.getSubPack = async (req, res) => {
  const subPack = await SubPack.findOne({
    where: { id: req.params.id, isPublished: true },
    include: [
      { model: Pack, as: "pack" },
      { model: Routine, as: "routines", separate: true, order: [["order", "ASC"]] },
    ],
  });
  if (!subPack) return res.status(404).json({ error: "No encontrado" });

  let owned = false;
  if (req.user) {
    const activation = await UserPack.findOne({
      where: { userId: req.user.id, subPackId: subPack.id, active: true },
    });
    owned = !!activation;
  }

  const data = subPack.toJSON();
  // Si no lo compro, no mandamos la URL real del video para no filtrarla.
  if (!owned) {
    data.routines = data.routines.map((r) => ({ ...r, videoUrl: null }));
  }
  res.json({ subPack: data, owned });
};

// Pantalla de reproduccion de una rutina puntual. Requiere haber comprado el subpack correspondiente.
exports.getRoutine = async (req, res) => {
  const routine = await Routine.findByPk(req.params.id, {
    include: [{ model: SubPack, as: "subPack", include: [{ model: Pack, as: "pack" }] }],
  });
  if (!routine) return res.status(404).json({ error: "No encontrada" });

  const activation = await UserPack.findOne({
    where: { userId: req.user.id, subPackId: routine.subPackId, active: true },
  });
  if (!activation) return res.status(403).json({ error: "Todavía no compraste este pack" });

  res.json({ routine });
};
