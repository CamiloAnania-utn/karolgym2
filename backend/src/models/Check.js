const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// "CHECK": lo que el usuario comparte despues de entrenar.
const Check = sequelize.define("Check", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  note: { type: DataTypes.STRING, allowNull: true },
  photoUrl: { type: DataTypes.STRING, allowNull: true },
  visibility: { type: DataTypes.ENUM("publico", "privado"), defaultValue: "privado" },
}, {
  tableName: "checks",
  timestamps: true,
});

module.exports = Check;
