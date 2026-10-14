const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Favorite = sequelize.define("Favorite", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  contentType: { type: DataTypes.ENUM("free_content", "routine"), allowNull: false },
  contentId: { type: DataTypes.UUID, allowNull: false },
}, {
  tableName: "favorites",
  timestamps: true,
  indexes: [{ unique: true, fields: ["userId", "contentType", "contentId"] }],
});

module.exports = Favorite;
