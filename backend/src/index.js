import app from "./app.js";
import dotenv from "dotenv";
import connectDb from "./db/db.connect.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

//Database connection
connectDb();

app.get("/", (req, res) => {
  res.send("Welcome to FormCraft!");
});

app.listen(PORT, () => {
  console.log(`Backend is listening on port: ${PORT}`);
});
