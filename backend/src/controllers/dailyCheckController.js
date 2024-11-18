// src/controllers/dailyCheckController.js
const dailyCheckService = require("../services/dailyCheckService");

// Utility function for handling inspection creation
const handleInspectionCreation = async (req, res, isPublic = false) => {
  try {
    const {
      machine_name,
      machine_no,
      model,
      customer,
      family,
      maintenance_type,
      employee_id,
      checked_at,
      inspections
    } = req.body;

    if (!inspections || !Array.isArray(inspections)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inspections data"
      });
    }

    // Map inspections to match database structure
    const inspectionRecords = inspections.map(inspection => ({
      machine_name,
      machine_no,
      model,
      customer,
      family,
      maintenance_type: maintenance_type || 'daily_check',
      user_id: employee_id,
      checked_at,
      checklist_item_id: inspection.checklist_item_id,
      status: inspection.status,
      issue_detail: inspection.issue_detail || null
    }));

    const results = await dailyCheckService.createInspection(inspectionRecords);

    res.status(201).json({
      success: true,
      message: "Inspection recorded successfully",
      data: results
    });
  } catch (error) {
    console.error(`Error creating ${isPublic ? 'public' : ''} inspection:`, error);
    res.status(500).json({
      success: false,
      message: "Failed to create inspection",
      error: error.message
    });
  }
};

// Utility function for handling idle inspection creation
const handleIdleInspectionCreation = async (req, res, isPublic = false) => {
  try {
    const {
      machine_name,
      machine_no,
      model,
      customer,
      family,
      maintenance_type,
      employee_id,
      checked_at
    } = req.body;

    const result = await dailyCheckService.createIdleInspection({
      machine_name,
      machine_no,
      model,
      customer,
      family,
      maintenance_type: 'mc_idle',
      user_id: employee_id,
      checked_at,
      status: 'idle',
      issue_detail: null
    });

    res.status(201).json({
      success: true,
      message: "Machine idle status recorded successfully",
      data: result
    });
  } catch (error) {
    console.error(`Error creating ${isPublic ? 'public' : ''} idle inspection:`, error);
    res.status(500).json({
      success: false,
      message: "Failed to create idle inspection",
      error: error.message
    });
  }
};

// Authenticated endpoints
const createInspection = async (req, res) => {
  await handleInspectionCreation(req, res);
};

const createIdleInspection = async (req, res) => {
  await handleIdleInspectionCreation(req, res);
};

// Public endpoints
const createPublicInspection = async (req, res) => {
  await handleInspectionCreation(req, res, true);
};

const createPublicIdleInspection = async (req, res) => {
  await handleIdleInspectionCreation(req, res, true);
};

module.exports = {
  createInspection,
  createIdleInspection,
  createPublicInspection,
  createPublicIdleInspection
};