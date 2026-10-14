const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Un dia de entrenamiento = un video completo (ejercicios, tiempos y descansos ya editados adentro).
const Routine = sequelize.define("Routine", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false }, // ej "Dia 1"
  videoUrl: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  durationMinutes: { type: DataTypes.INTEGER, allowNull: true },
  equipment: { type: DataTypes.STRING, allowNull: true },
  level: { type: DataTypes.STRING, allowNull: true },
  objective: { type: DataTypes.STRING, allowNull: true },
  categories: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: "routines",
  timestamps: true,
});

module.exports = Routine;
