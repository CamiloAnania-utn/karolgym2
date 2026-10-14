const { PersonalizedRequest, User } = require("../models");

exports.request = async (req, res) => {
  const { formData } = req.body;
  const existingPending = await PersonalizedRequest.findOne({
    where: { userId: req.user.id, status: "pendiente" },
  });
  if (existingPending) return res.status(409).json({ error: "Ya tenes una solicitud pendiente" });

  const request = await PersonalizedRequest.create({ userId: req.user.id, formData: formData || {} });
  res.status(201).json({ request });
};

exports.mine = async (req, res) => {
  const requests = await PersonalizedRequest.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "DESC"]],
  });
  res.json({ requests });
};
