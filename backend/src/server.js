require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const authRoutes = require("./routes/authRoutes");
const packsRoutes = require("./routes/packsRoutes");
const freeContentRoutes = require("./routes/freeContentRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const accountRoutes = require("./routes/accountRoutes");
const walkRoutes = require("./routes/walkRoutes");
const checkRoutes = require("./routes/checkRoutes");
const personalizedRoutes = require("./routes/personalizedRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true, app: "KAROLGYM API" }));

app.use("/api/auth", authRoutes);
app.use("/api/packs", packsRoutes);
app.use("/api/contenido-gratis", freeContentRoutes);
app.use("/api/compras", purchaseRoutes);
app.use("/api/cuenta", accountRoutes);
app.use("/api/caminatas", walkRoutes);
app.use("/api/checks", checkRoutes);
app.use("/api/personalizados", personalizedRoutes);
app.use("/api/admin", adminRoutes);

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a PostgreSQL");
    // En desarrollo: sincroniza los modelos con la base.
    // En produccion, reemplazar por migraciones reales (sequelize-cli).
    await sequelize.sync();
    console.log("✅ Modelos sincronizados");

    app.listen(PORT, () => console.log(`🧡 KAROLGYM API corriendo en http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ No se pudo iniciar el servidor:", err);
    process.exit(1);
  }
}

start();
