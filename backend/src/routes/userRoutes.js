// src/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// ไม่ต้องมี login และ register ที่นี่แล้ว เพราะย้ายไป public routes แล้ว
router.delete("/delete", userController.deleteUser);
router.put("/updateProfile", userController.updateProfile);
router.get("/profile", userController.getProfile);

module.exports = router;