const sequelize = require("../config/database");

const User = require("./User");
const Pack = require("./Pack");
const SubPack = require("./SubPack");
const Routine = require("./Routine");
const FreeContent = require("./FreeContent");
const Purchase = require("./Purchase");
const UserPack = require("./UserPack");
const Favorite = require("./Favorite");
const Check = require("./Check");
const CompletedWorkout = require("./CompletedWorkout");
const Walk = require("./Walk");
const PersonalizedRequest = require("./PersonalizedRequest");
const NotificationSetting = require("./NotificationSetting");

// Pack -> SubPack -> Routine
Pack.hasMany(SubPack, { foreignKey: "packId", as: "subPacks", onDelete: "CASCADE" });
SubPack.belongsTo(Pack, { foreignKey: "packId", as: "pack" });

SubPack.hasMany(Routine, { foreignKey: "subPackId", as: "routines", onDelete: "CASCADE" });
Routine.belongsTo(SubPack, { foreignKey: "subPackId", as: "subPack" });

// User <-> SubPack a traves de Purchase
User.hasMany(Purchase, { foreignKey: "userId", as: "purchases" });
Purchase.belongsTo(User, { foreignKey: "userId", as: "user" });
SubPack.hasMany(Purchase, { foreignKey: "subPackId", as: "purchases" });
Purchase.belongsTo(SubPack, { foreignKey: "subPackId", as: "subPack" });

// User <-> SubPack activo (puede tener varios)
User.belongsToMany(SubPack, { through: UserPack, foreignKey: "userId", otherKey: "subPackId", as: "activePacks" });
SubPack.belongsToMany(User, { through: UserPack, foreignKey: "subPackId", otherKey: "userId", as: "owners" });
User.hasMany(UserPack, { foreignKey: "userId", as: "userPacks" });
UserPack.belongsTo(User, { foreignKey: "userId", as: "user" });
UserPack.belongsTo(SubPack, { foreignKey: "subPackId", as: "subPack" });
UserPack.belongsTo(Purchase, { foreignKey: "purchaseId", as: "purchase" });

// Favoritos
User.hasMany(Favorite, { foreignKey: "userId", as: "favorites", onDelete: "CASCADE" });
Favorite.belongsTo(User, { foreignKey: "userId", as: "user" });

// Checks (comunidad)
User.hasMany(Check, { foreignKey: "userId", as: "checks", onDelete: "CASCADE" });
Check.belongsTo(User, { foreignKey: "userId", as: "user" });
Routine.hasMany(Check, { foreignKey: "routineId", as: "checks" });
Check.belongsTo(Routine, { foreignKey: "routineId", as: "routine" });

// Historial / progreso
User.hasMany(CompletedWorkout, { foreignKey: "userId", as: "completedWorkouts", onDelete: "CASCADE" });
CompletedWorkout.belongsTo(User, { foreignKey: "userId", as: "user" });
Routine.hasMany(CompletedWorkout, { foreignKey: "routineId", as: "completions" });
CompletedWorkout.belongsTo(Routine, { foreignKey: "routineId", as: "routine" });

// Caminatas
User.hasMany(Walk, { foreignKey: "userId", as: "walks", onDelete: "CASCADE" });
Walk.belongsTo(User, { foreignKey: "userId", as: "user" });

// Personalizados 1:1
User.hasMany(PersonalizedRequest, { foreignKey: "userId", as: "personalizedRequests", onDelete: "CASCADE" });
PersonalizedRequest.belongsTo(User, { foreignKey: "userId", as: "user" });

// Configuracion de notificaciones (1 a 1)
User.hasOne(NotificationSetting, { foreignKey: "userId", as: "notificationSetting", onDelete: "CASCADE" });
NotificationSetting.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
  sequelize,
  User,
  Pack,
  SubPack,
  Routine,
  FreeContent,
  Purchase,
  UserPack,
  Favorite,
  Check,
  CompletedWorkout,
  Walk,
  PersonalizedRequest,
  NotificationSetting,
};
