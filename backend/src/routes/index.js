// src/routes/index.js

const express = require("express");
const router = express.Router();

// Import routes
const userRoutes = require("./userRoutes");
const machineRoutes = require("./machineRoutes");
const checklistRoutes = require("./checklistRoutes");
const publicRoutes = require("./publicRoutes");
const dailyCheckRoutes = require("./dailyCheckRoutes");

// Public routes first
router.use("/public", publicRoutes);

// Then protected routes
router.use("/users", userRoutes);
router.use("/machines", machineRoutes);
router.use("/checklist", checklistRoutes);
router.use("/daily-check", dailyCheckRoutes);

module.exports = router;
