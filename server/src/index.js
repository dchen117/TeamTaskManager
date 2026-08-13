import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import workspaceRoute from "./routes/workspaceRoute.js";
import projectRoute from "./routes/projectRoute.js";
import statusRoute from "./routes/statusRoute.js"
import taskRoute from "./routes/taskRoute.js";
import path from "path";
import cookieParser from "cookie-parser";

/* TODO: Remove after deployment */
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(import.meta.dirname, "config/.env") });
/* ----------------------------- */

const app = express();
const corsOptions = { // TODO: Configure CORS properly before deployment
  origin: process.env.CLIENT_URL,
  credentials: true,
};
// app.options('*', cors(corsOptions));
app.use(cors(corsOptions)); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoute);
app.use("/api/workspaces", workspaceRoute);
app.use("/api/projects", projectRoute);
app.use("/api/statuses", statusRoute);
app.use("/api/tasks", taskRoute);

(async () => {
  await mongoose.connect(process.env.MONGO_STRING_CONNECTION);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();
