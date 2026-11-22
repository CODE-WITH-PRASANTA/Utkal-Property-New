const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");


// Load Environment Variables
dotenv.config();

// Initialize App
const app = express();

// Connect Database
connectDB();

// CORS Configuration from .env
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default API
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Utkal Property Backend API Running Successfully",
  });
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/properties", require("./routes/propertyRoutes"));

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});