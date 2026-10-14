const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Activacion: un usuario puede tener varios packs activos a la vez.
const UserPack = sequelize.define("UserPack", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  activatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: "user_packs",
  timestamps: true,
});

module.exports = UserPack;
