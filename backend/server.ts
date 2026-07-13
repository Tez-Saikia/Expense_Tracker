import  "dotenv/config";

import { app } from "./src/app.js";
import connectDB from "./src/db/db.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on PORT: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
