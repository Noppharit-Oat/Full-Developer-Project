// src/controllers/machineController.js
const machineService = require("../services/machineService");

// ดึงข้อมูลเครื่องจักรทั้งหมด
const getAllMachines = async (req, res) => {
  try {
    const machines = await machineService.getAllMachines();
    res.status(200).json({
      message: "Machines retrieved successfully",
      machines: machines,
    });
  } catch (error) {
    console.error("Error getting machines:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// ดึงข้อมูลเครื่องจักรตาม ID
const getMachineById = async (req, res) => {
  try {
    const machine = await machineService.getMachineById(req.params.id);
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }
    res.status(200).json({
      message: "Machine retrieved successfully",
      machine: machine,
    });
  } catch (error) {
    console.error("Error getting machine:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// เพิ่มเครื่องจักรใหม่
const createMachine = async (req, res) => {
  try {
    const newMachine = await machineService.createMachine(req.body);
    res.status(201).json({
      message: "Machine created successfully",
      machine: newMachine,
    });
  } catch (error) {
    console.error("Error creating machine:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// อัพเดตข้อมูลเครื่องจักร
const updateMachine = async (req, res) => {
  try {
    const updatedMachine = await machineService.updateMachine(
      req.params.id,
      req.body
    );
    if (!updatedMachine) {
      return res.status(404).json({ message: "Machine not found" });
    }
    res.status(200).json({
      message: "Machine updated successfully",
      machine: updatedMachine,
    });
  } catch (error) {
    console.error("Error updating machine:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// ลบเครื่องจักร
const deleteMachine = async (req, res) => {
  try {
    const deletedMachine = await machineService.deleteMachine(req.params.id);
    if (!deletedMachine) {
      return res.status(404).json({ message: "Machine not found" });
    }
    res.status(200).json({
      message: "Machine deleted successfully",
      machine: deletedMachine,
    });
  } catch (error) {
    console.error("Error deleting machine:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
};
