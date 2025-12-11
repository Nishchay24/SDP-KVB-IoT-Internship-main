const express = require("express");
const router = express.Router();
const { protect, authorizeAdmin } = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

// User dashboard
router.get("/dashboard/user", protect, dashboardController.userDashboard);

// Admin dashboard
router.get(
  "/dashboard/admin",
  protect,
  authorizeAdmin,
  dashboardController.adminDashboard
);

// 🔹 Admin-only routes for user management

// Get all users (name, phone, devices)
router.get("/users", protect, authorizeAdmin, dashboardController.getUsers);

// Search users by name or phone
router.get(
  "/users/search",
  protect,
  authorizeAdmin,
  dashboardController.searchUser
);

// Add device to a user (by phone)
router.post(
  "/users/device/add",
  protect,
  authorizeAdmin,
  dashboardController.addDevice
);

// Remove device from a user (by phone)
router.post(
  "/users/device/remove",
  protect,
  authorizeAdmin,
  dashboardController.removeDevice
);

module.exports = router;
