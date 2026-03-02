const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("College Saarthi API running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const cutoffRoutes = require("./routes/cutoff.routes");

app.use("/api/cutoffs", cutoffRoutes);

const predictionRoutes = require("./routes/prediction.routes");

app.use("/api/predict", predictionRoutes);