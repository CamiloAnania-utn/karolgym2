const { Check, User, Routine } = require("../models");

exports.create = async (req, res) => {
  const { routineId, note, photoUrl, visibility } = req.body;
  const check = await Check.create({
    userId: req.user.id,
    routineId: routineId || null,
    note,
    photoUrl,
    visibility: visibility === "publico" ? "publico" : "privado",
  });
  res.status(201).json({ check });
};

// Muro de la comunidad: solo checks publicos.
exports.community = async (req, res) => {
  const checks = await Check.findAll({
    where: { visibility: "publico" },
    include: [
      { model: User, as: "user", attributes: ["id", "name", "avatarUrl"] },
      { model: Routine, as: "routine", attributes: ["id", "title"] },
    ],
    order: [["createdAt", "DESC"]],
    limit: 50,
  });
  res.json({ checks });
};

exports.mine = async (req, res) => {
  const checks = await Check.findAll({ where: { userId: req.user.id }, order: [["createdAt", "DESC"]] });
  res.json({ checks });
};
