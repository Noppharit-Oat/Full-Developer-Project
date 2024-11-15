// src/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/login", userController.login);
router.post("/register", userController.register);

router.delete("/delete", authenticateToken, userController.deleteUser);
router.put("/updateProfile", authenticateToken, userController.updateProfile);
router.get("/profile", authenticateToken, userController.getProfile);

module.exports = router;
