const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Solicitud de plan 1:1 -> formulario -> revision -> aprobacion -> pago -> plan.
const PersonalizedRequest = sequelize.define("PersonalizedRequest", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  status: { type: DataTypes.ENUM("pendiente", "aprobado", "rechazado", "activo"), defaultValue: "pendiente" },
  formData: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  adminNotes: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: "personalized_requests",
  timestamps: true,
});

module.exports = PersonalizedRequest;
