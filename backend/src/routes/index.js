// src/routes/index.js

const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");

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

// Protected routes
router.use("/users", authenticateToken, userRoutes);
router.use("/machines", authenticateToken, machineRoutes);
router.use("/checklist", authenticateToken, checklistRoutes);
router.use("/inspections", authenticateToken, inspectionsRoutes);

module.exports = router;
