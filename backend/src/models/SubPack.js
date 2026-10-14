const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// El producto real que se compra, ej: "Inicial - 2 dias". Tiene precio y nivel propios.
const SubPack = sequelize.define("SubPack", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.ENUM("inicial", "intermedio", "avanzado"), allowNull: false },
  daysPerWeek: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  objective: { type: DataTypes.STRING, allowNull: true },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: "sub_packs",
  timestamps: true,
});

module.exports = SubPack;
