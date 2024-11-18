// src/routes/dailyCheckRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  createInspection,
  createIdleInspection,
  createPublicInspection,
  createPublicIdleInspection
} = require("../controllers/dailyCheckController");

// Protected routes (require authentication)
router.post("/inspection", authenticateToken, createInspection);
router.post("/inspection/idle", authenticateToken, createIdleInspection);

// Public routes (no authentication required)
router.post("/public/inspection", createPublicInspection);
router.post("/public/inspection/idle", createPublicIdleInspection);

module.exports = router;