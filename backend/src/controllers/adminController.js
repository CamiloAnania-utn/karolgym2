const slugify = require("slugify");
const {
  Pack, SubPack, Routine, FreeContent, Purchase, UserPack, User,
  PersonalizedRequest, CompletedWorkout, Favorite,
} = require("../models");

// ---- Packs ----
exports.createPack = async (req, res) => {
  const { name, description, coverImageUrl, isPublished, order } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  const pack = await Pack.create({ name, slug, description, coverImageUrl, isPublished, order });
  res.status(201).json({ pack });
};

exports.updatePack = async (req, res) => {
  const pack = await Pack.findByPk(req.params.id);
  if (!pack) return res.status(404).json({ error: "No encontrado" });
  const { name, description, coverImageUrl, isPublished, order } = req.body;
  if (name) { pack.name = name; pack.slug = slugify(name, { lower: true, strict: true }); }
  if (description !== undefined) pack.description = description;
  if (coverImageUrl !== undefined) pack.coverImageUrl = coverImageUrl;
  if (isPublished !== undefined) pack.isPublished = isPublished;
  if (order !== undefined) pack.order = order;
  await pack.save();
  res.json({ pack });
};

exports.deletePack = async (req, res) => {
  await Pack.destroy({ where: { id: req.params.id } });
  res.status(204).send();
};

exports.listAllPacks = async (req, res) => {
  const packs = await Pack.findAll({
    include: [{ model: SubPack, as: "subPacks", include: [{ model: Routine, as: "routines" }] }],
    order: [["order", "ASC"]],
  });
  res.json({ packs });
};

// ---- SubPacks ----
exports.createSubPack = async (req, res) => {
  const { packId, name, level, daysPerWeek, price, description, objective, isPublished, order } = req.body;
  if (!packId || !name || !level || !daysPerWeek || price === undefined) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }
  const slug = slugify(name, { lower: true, strict: true });
  const subPack = await SubPack.create({
    packId, name, slug, level, daysPerWeek, price, description, objective, isPublished, order,
  });
  res.status(201).json({ subPack });
};

exports.updateSubPack = async (req, res) => {
  const subPack = await SubPack.findByPk(req.params.id);
  if (!subPack) return res.status(404).json({ error: "No encontrado" });
  const fields = ["name", "level", "daysPerWeek", "price", "description", "objective", "isPublished", "order"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) subPack[f] = req.body[f];
  });
  if (req.body.name) subPack.slug = slugify(req.body.name, { lower: true, strict: true });
  await subPack.save();
  res.json({ subPack });
};

exports.deleteSubPack = async (req, res) => {
  await SubPack.destroy({ where: { id: req.params.id } });
  res.status(204).send();
};

// ---- Routines (rutina = un video por dia) ----
exports.createRoutine = async (req, res) => {
  const { subPackId, title, videoUrl, description, durationMinutes, equipment, level, objective, categories, order } = req.body;
  if (!subPackId || !title) return res.status(400).json({ error: "Faltan datos obligatorios" });
  const routine = await Routine.create({
    subPackId, title, videoUrl, description, durationMinutes, equipment, level, objective, categories, order,
  });
  res.status(201).json({ routine });
};

exports.updateRoutine = async (req, res) => {
  const routine = await Routine.findByPk(req.params.id);
  if (!routine) return res.status(404).json({ error: "No encontrado" });
  const fields = ["title", "videoUrl", "description", "durationMinutes", "equipment", "level", "objective", "categories", "order"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) routine[f] = req.body[f];
  });
  await routine.save();
  res.json({ routine });
};

exports.deleteRoutine = async (req, res) => {
  await Routine.destroy({ where: { id: req.params.id } });
  res.status(204).send();
};

// ---- Contenido gratuito ----
exports.createFreeContent = async (req, res) => {
  const item = await FreeContent.create(req.body);
  res.status(201).json({ item });
};

exports.updateFreeContent = async (req, res) => {
  const item = await FreeContent.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "No encontrado" });
  Object.assign(item, req.body);
  await item.save();
  res.json({ item });
};

exports.deleteFreeContent = async (req, res) => {
  await FreeContent.destroy({ where: { id: req.params.id } });
  res.status(204).send();
};

exports.listAllFreeContent = async (req, res) => {
  const items = await FreeContent.findAll({ order: [["createdAt", "DESC"]] });
  res.json({ items });
};

// ---- Compras / activacion de packs ----
exports.listPurchases = async (req, res) => {
  const { status } = req.query;
  const where = status ? { status } : {};
  const purchases = await Purchase.findAll({
    where,
    include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }, { model: SubPack, as: "subPack" }],
    order: [["createdAt", "DESC"]],
  });
  res.json({ purchases });
};

// Confirmar pago (manual, ej. transferencia verificada) -> activa el pack para el usuario.
exports.confirmPurchase = async (req, res) => {
  const purchase = await Purchase.findByPk(req.params.id);
  if (!purchase) return res.status(404).json({ error: "No encontrada" });

  purchase.status = "confirmado";
  purchase.confirmedAt = new Date();
  await purchase.save();

  await UserPack.findOrCreate({
    where: { userId: purchase.userId, subPackId: purchase.subPackId },
    defaults: { purchaseId: purchase.id, active: true },
  });

  res.json({ purchase });
};

exports.rejectPurchase = async (req, res) => {
  const purchase = await Purchase.findByPk(req.params.id);
  if (!purchase) return res.status(404).json({ error: "No encontrada" });
  purchase.status = "rechazado";
  await purchase.save();
  res.json({ purchase });
};

// ---- Usuarios / alumnos ----
exports.listUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role", "phone", "createdAt"],
    order: [["createdAt", "DESC"]],
  });
  res.json({ users });
};

exports.getUserDetail = async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ["id", "name", "email", "role", "phone", "createdAt"],
  });
  if (!user) return res.status(404).json({ error: "No encontrado" });

  const [activePacks, completedWorkouts, requests] = await Promise.all([
    UserPack.findAll({ where: { userId: user.id, active: true }, include: [{ model: SubPack, as: "subPack" }] }),
    CompletedWorkout.count({ where: { userId: user.id } }),
    PersonalizedRequest.findAll({ where: { userId: user.id }, order: [["createdAt", "DESC"]] }),
  ]);

  res.json({ user, activePacks, completedWorkoutsCount: completedWorkouts, personalizedRequests: requests });
};

// Dar de baja/alta manual de un pack para un usuario (soporte).
exports.toggleUserPack = async (req, res) => {
  const { userId, subPackId, active } = req.body;
  const [userPack] = await UserPack.findOrCreate({ where: { userId, subPackId } });
  userPack.active = active !== undefined ? active : !userPack.active;
  await userPack.save();
  res.json({ userPack });
};

// ---- Personalizados 1:1 ----
exports.listPersonalizedRequests = async (req, res) => {
  const requests = await PersonalizedRequest.findAll({
    include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
    order: [["createdAt", "DESC"]],
  });
  res.json({ requests });
};

exports.updatePersonalizedRequest = async (req, res) => {
  const request = await PersonalizedRequest.findByPk(req.params.id);
  if (!request) return res.status(404).json({ error: "No encontrada" });
  const { status, adminNotes } = req.body;
  if (status) request.status = status;
  if (adminNotes !== undefined) request.adminNotes = adminNotes;
  await request.save();
  res.json({ request });
};

// ---- Estadisticas basicas ----
exports.stats = async (req, res) => {
  const [totalUsers, totalPurchasesConfirmed, totalRevenueRow, totalFavorites, totalCompleted] = await Promise.all([
    User.count(),
    Purchase.count({ where: { status: "confirmado" } }),
    Purchase.sum("amount", { where: { status: "confirmado" } }),
    Favorite.count(),
    CompletedWorkout.count(),
  ]);

  res.json({
    totalUsers,
    totalPurchasesConfirmed,
    totalRevenue: totalRevenueRow || 0,
    totalFavorites,
    totalCompletedWorkouts: totalCompleted,
  });
};
