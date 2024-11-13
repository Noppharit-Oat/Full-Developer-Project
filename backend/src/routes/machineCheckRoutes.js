// src/routes/machineCheckRoutes.js

const express = require("express");
const router = express.Router();
const machineCheckController = require("../controllers/machineCheckController");
const authMiddleware = require("../middlewares/authMiddleware");

// ดึงรายการ checklist
router.get("/checklist", authMiddleware, async (req, res) => {
  try {
    const frequency = req.query.frequency || "daily";
    const checklist = await machineCheckController.getChecklist(frequency);
    res.status(200).json({ success: true, data: checklist });
  } catch (error) {
    console.error("Error in getChecklist:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// บันทึกผลการตรวจเช็ค
router.post("/check-result", authMiddleware, async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid request body" });
    }
    const checkData = {
      ...req.body,
      userId: req.user.id, // จาก auth middleware
    };
    const checkRecordId = await machineCheckController.saveCheckResult(
      checkData
    );
    res.status(200).json({
      success: true,
      message: "บันทึกผลการตรวจเช็คเรียบร้อย",
      checkRecordId,
    });
  } catch (error) {
    console.error("Error in saveCheckResult:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ดึงประวัติการตรวจเช็ค
router.get("/history", authMiddleware, async (req, res) => {
  try {
    if (!req.query.machineId || !req.query.startDate || !req.query.endDate) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid query parameters" });
    }
    const { machineId, startDate, endDate } = req.query;
    const history = await machineCheckController.getCheckHistory(
      machineId,
      startDate,
      endDate
    );
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error("Error in getCheckHistory:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
