const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Walk = sequelize.define("Walk", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  status: { type: DataTypes.ENUM("en_curso", "pausada", "finalizada"), defaultValue: "en_curso" },
  steps: { type: DataTypes.INTEGER, defaultValue: 0 },
  distanceKm: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
  durationSeconds: { type: DataTypes.INTEGER, defaultValue: 0 },
  routeGeoJson: { type: DataTypes.JSONB, allowNull: true },
  startedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  endedAt: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: "walks",
  timestamps: true,
});

module.exports = Walk;
