// src/routes/publicRoutes.js
const express = require("express");
const router = express.Router();
const checklistController = require("../controllers/checklistController");
const dailyCheckController = require("../controllers/dailyCheckController");

// Checklist routes
router.get("/checklist", checklistController.getPublicChecklistByParams);

router.post("/daily-check", dailyCheckController.createPublicInspection);
router.post("/daily-check/idle", dailyCheckController.createPublicIdleInspection);

module.exports = router;
