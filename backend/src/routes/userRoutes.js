// src/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.delete("/delete", userController.deleteUser);
router.put("/updateProfile", userController.updateProfile);

module.exports = router;