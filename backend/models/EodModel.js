import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js"; // Import the Users model to define the association

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
        model: Users, // Reference the 'users' model
        key: "id", // Key in 'users' table to reference
      },
    },
    date: {
      type: DataTypes.DATEONLY, // Stores only the date (YYYY-MM-DD format)
      allowNull: false, // Cannot be null
    },
    time: {
      type: DataTypes.STRING(20), // varchar(20) for storing time
      allowNull: false, // Cannot be null
    },
    description: {
      type: DataTypes.TEXT, // Text field for description
      allowNull: false, // Cannot be null
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
    },
  },
  {
    freezeTableName: true, // Prevent Sequelize from pluralizing the table name
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Define association between Users and Eod
Eod.belongsTo(Users, { foreignKey: "user_id", as: "user" });

export default Eod;
