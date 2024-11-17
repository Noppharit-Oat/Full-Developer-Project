// src/routes/dailyCheckRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const controller = require("../controllers/dailyCheckController");

router.post("/", authMiddleware, controller.createDailyCheck);
router.get("/history", authMiddleware, controller.getDailyCheckHistory);
router.post("/public", controller.createDailyCheck);
router.get("/public/history", controller.getDailyCheckHistory);

module.exports = router;