// src/routes/index.js

const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");

router.use((req, res, next) => {
  console.log("\n=== Index Route Debug ===");
  console.log("Path:", req.path);
  console.log("Base URL:", req.baseUrl);
  next();
});

// Import routes
const userRoutes = require("./userRoutes");
const machineRoutes = require("./machineRoutes");
const checklistRoutes = require("./checklistRoutes");
const publicRoutes = require("./publicRoutes");
const inspectionsRoutes = require("./inspectionsRoutes");
const authRoutes = require("./authRoutes");

// Public routes
router.use("/public", publicRoutes);
router.use("/auth", authRoutes);
router.use("/users", authenticateToken, userRoutes);
router.use("/machines", authenticateToken, machineRoutes);
router.use("/checklist", authenticateToken, checklistRoutes);
router.use("/inspections", authenticateToken, inspectionsRoutes);

module.exports = router;
