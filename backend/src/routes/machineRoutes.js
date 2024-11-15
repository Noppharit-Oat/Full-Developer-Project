// src/routes/machineRoutes.js

const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");

const {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
} = require("../controllers/machineController");

router.get("/", authenticateToken, getAllMachines);

router.get("/:id", authenticateToken, getMachineById);

router.post("/", authenticateToken, createMachine);

router.put("/:id", authenticateToken, updateMachine);

router.delete("/:id", authenticateToken, deleteMachine);

module.exports = router;
