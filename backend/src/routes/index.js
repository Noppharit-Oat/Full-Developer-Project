// src/routes/index.js

const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const machineRoutes = require("./machineRoutes");
const checklistRoutes = require("./checklistRoutes");
const publicRoutes = require("./publicRoutes");

// Public routes ต้องอยู่ก่อน protected routes
router.use("/public", publicRoutes);

// Protected routes
router.use("/", userRoutes);
router.use("/machines", machineRoutes);
router.use("/checklist", checklistRoutes);

module.exports = router;
