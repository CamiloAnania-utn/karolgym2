const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NotificationSetting = sequelize.define("NotificationSetting", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nightBeforeReminder: { type: DataTypes.BOOLEAN, defaultValue: true },
  sameDayReminder: { type: DataTypes.BOOLEAN, defaultValue: true },
  reminderTime: { type: DataTypes.STRING, defaultValue: "08:00" },
}, {
  tableName: "notification_settings",
  timestamps: true,
});

module.exports = NotificationSetting;
