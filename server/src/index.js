const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

/* Remove after deployment */
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
/* ----------------------- */

const app = express();
app.use(cors());
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

(async () => {
  await mongoose.connect(process.env.MONGO_STRING_CONNECTION);
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
