import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import path from "path";
import cookieParser from "cookie-parser";

/* TODO: Remove after deployment */
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(import.meta.dirname, "config/.env") });
/* ----------------------------- */

const app = express();
const corsOptions = { // TODO: Configure CORS properly before deployment
  origin: true,
  credentials: true,
};
// app.options('*', cors(corsOptions));
app.use(cors(corsOptions)); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const port = 5000;

app.use("/api/auth", authRoute);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

(async () => {
  await mongoose.connect(process.env.MONGO_STRING_CONNECTION);
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
