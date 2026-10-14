const { Walk } = require("../models");

exports.start = async (req, res) => {
  const walk = await Walk.create({ userId: req.user.id, status: "en_curso" });
  res.status(201).json({ walk });
};

exports.update = async (req, res) => {
  const { steps, distanceKm, durationSeconds, routeGeoJson, status } = req.body;
  const walk = await Walk.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!walk) return res.status(404).json({ error: "No encontrada" });

  if (steps !== undefined) walk.steps = steps;
  if (distanceKm !== undefined) walk.distanceKm = distanceKm;
  if (durationSeconds !== undefined) walk.durationSeconds = durationSeconds;
  if (routeGeoJson !== undefined) walk.routeGeoJson = routeGeoJson;
  if (status) walk.status = status;
  if (status === "finalizada") walk.endedAt = new Date();

  await walk.save();
  res.json({ walk });
};

exports.myWalks = async (req, res) => {
  const walks = await Walk.findAll({ where: { userId: req.user.id }, order: [["startedAt", "DESC"]] });
  res.json({ walks });
};
