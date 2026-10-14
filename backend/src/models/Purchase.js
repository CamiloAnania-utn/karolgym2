const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Purchase = sequelize.define("Purchase", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentMethod: { type: DataTypes.ENUM("mercado_pago", "transferencia"), allowNull: false },
  status: { type: DataTypes.ENUM("pendiente", "confirmado", "rechazado"), defaultValue: "pendiente" },
  transferProofUrl: { type: DataTypes.STRING, allowNull: true },
  confirmedAt: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: "purchases",
  timestamps: true,
});

module.exports = Purchase;
