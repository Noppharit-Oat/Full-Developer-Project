// src/routes/index.js

const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
// const machineCheckRoutes = require("./machineCheckRoutes");

router.use("/", userRoutes);
// router.use("/", machineCheckRoutes);

module.exports = router;