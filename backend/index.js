import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
import { Users, Eod } from "./models/index.js";

import router from "./routes/index.js";
dotenv.config();
const app = express();

(async () => {
  try {
    await db.authenticate(); // Test database connection
    console.log("Database connected...");

    await db.sync({ alter: true }); // Synchronize all models
    console.log("Models synchronized successfully.");
  } catch (error) {
    console.error("Error during model synchronization:", error);
  }
})();
 
app.use(cors({ credentials:true, origin:'http://localhost:3001' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, ()=> console.log('Server running at port 5000'));