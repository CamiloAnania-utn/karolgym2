const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Carpeta general, ej: "Full Body Fem". No tiene precio propio: el precio vive en SubPack.
const Pack = sequelize.define("Pack", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  coverImageUrl: { type: DataTypes.STRING, allowNull: true },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: "packs",
  timestamps: true,
});

module.exports = Pack;
