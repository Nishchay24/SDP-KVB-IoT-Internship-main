require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const locationRoutes = require("./routes/location");
const dashboardRoutes = require("./routes/dashboard");
const deviceRoutes = require("./routes/deviceRoutes");
const cropRoutes = require("./routes/cropRoutes");
const deviceConfigRoutes = require("./routes/deviceConfig");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect database
connectDB();

// Middleware
app.use(helmet());
// app.use(cors());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/device-config", deviceConfigRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "MERN Auth backend is running" });
});

const PORT = process.env.PORT || 5000;
// console.log(
//   process.env.EMAIL_HOST,
//   process.env.EMAIL_USER,
//   process.env.EMAIL_PASS
// );

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
