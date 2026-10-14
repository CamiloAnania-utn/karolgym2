const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Contenido gratuito: visible sin cuenta, pero hay que loguearse para reproducirlo.
const FreeContent = sequelize.define("FreeContent", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false }, // Tecnica, Movilidad, CORE, Running, Caminatas...
  videoUrl: { type: DataTypes.STRING, allowNull: true },
  thumbnailUrl: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  durationMinutes: { type: DataTypes.INTEGER, allowNull: true },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: "free_contents",
  timestamps: true,
});

module.exports = FreeContent;
