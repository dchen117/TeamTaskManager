import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.js";

/* Remove after deployment */
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
/* ----------------------- */

const app = express();
app.use(cors());
const port = 5000;

app.post("/api/auth", authRoute);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

(async () => {
  await mongoose.connect(process.env.MONGO_STRING_CONNECTION);
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
