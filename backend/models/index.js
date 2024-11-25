import Users from "./UserModel.js";
import Eod from "./EodModel.js";

// Define associations
Users.hasMany(Eod, { foreignKey: "user_id" }); // A user can have many EODs
Eod.belongsTo(Users, { foreignKey: "user_id" }); // Each EOD belongs to a user

export { Users, Eod };
