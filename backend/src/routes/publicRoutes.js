// src/routes/publicRoutes.js

const express = require("express");
const router = express.Router();
const checklistController = require("../controllers/checklistController");
const inspectionsController = require("../controllers/inspectionsController");
const userController = require("../controllers/userController");

// debug middleware for public routes
router.use((req, res, next) => {
  console.log("\n=== Public Route Debug ===");
  console.log("Path:", req.path);
  console.log("Method:", req.method);
  console.log("Body:", req.body);
  next();
});

// Authentication routes
router.post("/login", userController.login);
router.post("/register", userController.register);

// Checklist routes
router.get("/checklist", checklistController.getPublicChecklistByParams);

// Inspection routes - จัดลำดับใหม่
router.get(
  "/inspections/machine/:machine_name",
  inspectionsController.getInspectionsByMachine
);
router.get(
  "/inspections/status/:status",
  inspectionsController.getInspectionsByStatus
);
router.get("/inspections/:id", inspectionsController.getInspectionById);
router.get("/inspections", inspectionsController.getAllInspections);
router.post("/inspections", inspectionsController.createInspection);

module.exports = router;
