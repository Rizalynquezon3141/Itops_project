import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";  // Import the Users model to define association

const { DataTypes } = Sequelize;

const Eod = db.define(
  "eod",
  {
    eod_id: {
      type: DataTypes.INTEGER.UNSIGNED, // Unsigned integer for the EOD ID
      autoIncrement: true, // Auto-incrementing ID
      primaryKey: true, // Set as the primary key
      allowNull: false, // Cannot be null
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED, // Foreign key referencing 'users' table
      allowNull: false, // Cannot be null
      references: {
        model: Users,  // Reference the 'users' model
        key: 'id',     // Key in 'users' table to reference
      },
    },
    shift: {
      type: DataTypes.STRING(50), // varchar(50)
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // Text field for description
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Default to current timestamp
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Default to current timestamp
      onUpdate: DataTypes.NOW,     // Update timestamp on row update
    },
  },
  {
    freezeTableName: true,  // Prevent Sequelize from pluralizing the table name
    timestamps: true,       // Automatically add createdAt and updatedAt
  }
);

// Define the association with the Users model
Users.hasMany(Eod, { foreignKey: 'user_id' }); // A user can have many EODs
Eod.belongsTo(Users, { foreignKey: 'user_id' }); // Each EOD belongs to one user

// Sync the model with the database
(async () => {
  try {
    await db.sync({ alter: true }); // Synchronize the model (use alter for safe schema changes)
    console.log("EOD table synchronized with the database");
  } catch (error) {
    console.error("Error syncing EOD table:", error);
  }
})();

export default Eod;
