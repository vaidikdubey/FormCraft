import app from "./app.js";
import dotenv from "dotenv";
import connectDb from "./db/db.connect.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

//Database connection
connectDb()
  .then(() => {
    app.listen(PORT, console.log(`Server is running on PORT: ${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection error: ", err);
    process.exit(1);
  });
