require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Initialize Express
const app = express();

// Middleware
app.use(express.json());  // Parse JSON body
app.use(cors());          // Enable CORS for frontend requests
app.use(helmet());        // Security headers
app.use(morgan("dev"));   // Logs API requests

// Connect to Database
connectDB();

// Define Routes (Will implement later)
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Home Route
app.get("/", (req, res) => {
    res.send("To-Do App API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
