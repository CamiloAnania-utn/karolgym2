const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Registro de historial/progreso: cada vez que se completa una rutina.
const CompletedWorkout = sequelize.define("CompletedWorkout", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  completedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "completed_workouts",
  timestamps: true,
});

module.exports = CompletedWorkout;
