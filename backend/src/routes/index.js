// src/routes/index.js

const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const machineRoutes = require("./machineRoutes");
const checklistRoutes = require("./checklistRoutes");

router.use("/", userRoutes);
router.use("/machines", machineRoutes);
router.use("/checklist", checklistRoutes);

module.exports = router;
