// src/routes/inspectionsRoutes.js
const express = require("express");
const router = express.Router();
const inspectionsController = require("../controllers/inspectionsController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// ทุก route ต้องผ่าน authentication
router.use(authenticateToken);

// Protected Routes (ต้องการ authentication)
router.post("/", inspectionsController.createInspection);
router.put("/:id", inspectionsController.updateInspection);
router.patch("/:id/status", inspectionsController.updateStatus);
router.delete("/:id", inspectionsController.deleteInspection);
router.post("/:id/attachments", inspectionsController.uploadAttachments);

module.exports = router;