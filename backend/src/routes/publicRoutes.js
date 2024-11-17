// src/routes/publicRoutes.js
const express = require("express");
const router = express.Router();
const checklistController = require("../controllers/checklistController");

// Checklist routes
router.get("/checklist", checklistController.getPublicChecklistByParams);

module.exports = router;
