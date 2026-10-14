const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "No autenticado" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ error: "No autenticado" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalido o vencido" });
  }
}

// No bloquea si no hay token, pero si hay uno valido, adjunta el usuario.
// Util para contenido gratuito que se puede VER sin cuenta.
async function attachUserIfPresent(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (user) req.user = user;
    next();
  } catch (err) {
    next();
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Requiere permisos de administrador" });
  }
  next();
}

module.exports = { requireAuth, attachUserIfPresent, requireAdmin };
