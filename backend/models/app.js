
import db from "../config/Database.js"; // Your database configuration
import Users from "./UserModel.js"; // User model
import Eod from "./EodModel.js"; // Eod model

// (async () => {
//   try {
//     // Synchronize all models
//     await db.sync({ alter: true }); // 'alter' adjusts tables without dropping them
//     console.log("Database synchronized successfully.");
//   } catch (error) {
//     console.error("Error synchronizing the database:", error);
//   }
// })();
(async () => {
  try {
    await db.authenticate(); // Test the database connection
    console.log("Database connection successful.");
    await db.sync({ alter: true });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();