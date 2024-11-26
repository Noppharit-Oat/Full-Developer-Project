// src/routes/publicRoutes.js

const express = require("express");
const router = express.Router();
const checklistController = require("../controllers/checklistController");
const inspectionsController = require("../controllers/inspectionsController");
const userController = require("../controllers/userController");

// Authentication routes
router.post("/login", userController.login);
router.post("/register", userController.register);

// Checklist routes
router.get("/checklist", checklistController.getPublicChecklistByParams);

// Inspection routes
router.get("/inspections", inspectionsController.getAllInspections);
router.get("/inspections/:id", inspectionsController.getInspectionById);
router.get(
  "/inspections/machine/:machine_name",
  inspectionsController.getInspectionsByMachine
);
router.get(
  "/inspections/status/:status",
  inspectionsController.getInspectionsByStatus
);

module.exports = router;
