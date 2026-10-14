const { FreeContent } = require("../models");

// Se puede listar y ver la info sin cuenta. Reproducir (videoUrl) requiere login -> ver requireAuth en la ruta.
exports.list = async (req, res) => {
  const { category } = req.query;
  const where = { isPublished: true };
  if (category) where.category = category;
  const items = await FreeContent.findAll({ where, order: [["createdAt", "DESC"]] });
  res.json({ items });
};

// Se puede ver la ficha sin cuenta, pero el video (videoUrl) solo se entrega si hay sesion.
exports.get = async (req, res) => {
  const item = await FreeContent.findOne({ where: { id: req.params.id, isPublished: true } });
  if (!item) return res.status(404).json({ error: "No encontrado" });

  const data = item.toJSON();
  const requiresLogin = !req.user;
  if (requiresLogin) data.videoUrl = null;

  res.json({ item: data, requiresLogin });
};
