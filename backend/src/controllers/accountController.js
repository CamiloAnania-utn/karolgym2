const { UserPack, SubPack, Pack, Routine, Favorite, FreeContent, CompletedWorkout, User, NotificationSetting } = require("../models");

exports.getProfile = async (req, res) => {
  const setting = await NotificationSetting.findOne({ where: { userId: req.user.id } });
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl,
      phone: req.user.phone,
    },
    notificationSetting: setting,
  });
};

exports.updateProfile = async (req, res) => {
  const { name, phone, avatarUrl } = req.body;
  const user = await User.findByPk(req.user.id);
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  await user.save();
  res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone, avatarUrl: user.avatarUrl } });
};

exports.updateNotificationSettings = async (req, res) => {
  const { nightBeforeReminder, sameDayReminder, reminderTime } = req.body;
  const [setting] = await NotificationSetting.findOrCreate({ where: { userId: req.user.id } });
  if (nightBeforeReminder !== undefined) setting.nightBeforeReminder = nightBeforeReminder;
  if (sameDayReminder !== undefined) setting.sameDayReminder = sameDayReminder;
  if (reminderTime) setting.reminderTime = reminderTime;
  await setting.save();
  res.json({ notificationSetting: setting });
};

// Packs activos del usuario (puede tener varios combinados en su calendario).
exports.myActivePacks = async (req, res) => {
  const userPacks = await UserPack.findAll({
    where: { userId: req.user.id, active: true },
    include: [
      {
        model: SubPack,
        as: "subPack",
        include: [{ model: Pack, as: "pack" }, { model: Routine, as: "routines" }],
      },
    ],
    order: [["activatedAt", "DESC"]],
  });
  res.json({ activePacks: userPacks });
};

exports.myFavorites = async (req, res) => {
  const favorites = await Favorite.findAll({ where: { userId: req.user.id }, order: [["createdAt", "DESC"]] });

  const freeContentIds = favorites.filter((f) => f.contentType === "free_content").map((f) => f.contentId);
  const routineIds = favorites.filter((f) => f.contentType === "routine").map((f) => f.contentId);

  const [freeContents, routines] = await Promise.all([
    freeContentIds.length ? FreeContent.findAll({ where: { id: freeContentIds } }) : [],
    routineIds.length ? Routine.findAll({ where: { id: routineIds } }) : [],
  ]);

  res.json({ freeContents, routines });
};

exports.addFavorite = async (req, res) => {
  const { contentType, contentId } = req.body;
  if (!["free_content", "routine"].includes(contentType) || !contentId) {
    return res.status(400).json({ error: "Datos invalidos" });
  }
  const [favorite] = await Favorite.findOrCreate({
    where: { userId: req.user.id, contentType, contentId },
  });
  res.status(201).json({ favorite });
};

exports.removeFavorite = async (req, res) => {
  await Favorite.destroy({ where: { userId: req.user.id, id: req.params.id } });
  res.status(204).send();
};

// Historial / progreso
exports.myHistory = async (req, res) => {
  const completed = await CompletedWorkout.findAll({
    where: { userId: req.user.id },
    include: [{ model: Routine, as: "routine", include: [{ model: SubPack, as: "subPack" }] }],
    order: [["completedAt", "DESC"]],
  });
  res.json({ completed });
};

exports.completeWorkout = async (req, res) => {
  const { routineId } = req.body;
  if (!routineId) return res.status(400).json({ error: "Falta routineId" });
  const record = await CompletedWorkout.create({ userId: req.user.id, routineId });
  res.status(201).json({ completed: record });
};
