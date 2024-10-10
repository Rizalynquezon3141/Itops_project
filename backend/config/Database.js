import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "mysql",
    timezone: "+08:00", // Set to Philippine Time (UTC+08:00)
    dialectOptions: {
      useUTC: false, // Prevents Sequelize from converting to UTC
    },
    logging: false, // Optional: Disable logging if not needed
  }
);

export default db;
