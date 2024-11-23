// src/controllers/dailyCheckController.js
const dailyCheckService = require("../services/dailyCheckService");

// Utility function for data validation
const validateRequiredFields = (data) => {
  const requiredFields = ["machine_name", "machine_no", "model", "customer", "family"];
  const missingFields = requiredFields.filter(field => {
    const value = data[field];
    return !value || String(value).trim() === '';
  });
  return missingFields;
};

// Utility function for handling inspection creation
const handleInspectionCreation = async (req, res, isPublic = false) => {
  try {
    console.log('Received inspection request body:', JSON.stringify(req.body, null, 2));

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

    // Validate required fields
    const missingFields = validateRequiredFields(req.body);
    if (missingFields.length > 0) {
      console.log('Validation failed. Missing fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: "Missing or empty required fields",
        missingFields,
        receivedData: {
          machine_name,
          machine_no,
          model,
          customer,
          family
        }
      });
    }

    if (!inspections || !Array.isArray(inspections)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inspections data - must be an array"
      });
    }

    // Map inspections to match database structure
    const inspectionRecords = inspections.map(inspection => ({
      machine_name: String(machine_name).trim(),
      machine_no: String(machine_no).trim(),
      model: String(model).trim(),
      customer: String(customer).trim(),
      family: String(family).trim(),
      maintenance_type: maintenance_type?.trim() || 'daily_check',
      user_id: employee_id || null,
      checked_at: checked_at || new Date().toISOString(),
      checklist_item_id: inspection.checklist_item_id,
      status: inspection.status?.trim() || 'pending',
      issue_detail: inspection.issue_detail?.trim() || null,
      action_taken: inspection.action_taken?.trim() || null,
      next_check_date: inspection.next_check_date || null,
      attachments: inspection.attachments || null
    }));

    console.log('Data to be sent to service:', JSON.stringify(inspectionRecords, null, 2));

    const results = await dailyCheckService.createInspection(inspectionRecords);

    res.status(201).json({
      success: true,
      message: "Inspection recorded successfully",
      data: results
    });
  } catch (error) {
    console.error('Inspection creation error:', {
      message: error.message,
      detail: error.detail,
      code: error.code,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: "Failed to create inspection",
      error: error.message,
      details: error.detail || 'No additional details'
    });
  }
};

// Utility function for handling idle inspection creation
const handleIdleInspectionCreation = async (req, res, isPublic = false) => {
  try {
    console.log('Received idle inspection request body:', JSON.stringify(req.body, null, 2));

    const {
      machine_name,
      machine_no,
      model,
      customer,
      family,
      employee_id,
      checked_at,
      action_taken,
      next_check_date,
      attachments
    } = req.body;

    // Validate required fields
    const missingFields = validateRequiredFields(req.body);
    if (missingFields.length > 0) {
      console.log('Validation failed. Missing fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: "Missing or empty required fields",
        missingFields,
        receivedData: {
          machine_name,
          machine_no,
          model,
          customer,
          family
        }
      });
    }

    // Create inspection data object
    const inspectionData = {
      machine_name: String(machine_name).trim(),
      machine_no: String(machine_no).trim(),
      model: String(model).trim(),
      customer: String(customer).trim(),
      family: String(family).trim(),
      user_id: employee_id || null,
      checked_at: checked_at || new Date().toISOString(),
      action_taken: action_taken?.trim() || null,
      next_check_date: next_check_date || null,
      attachments: attachments || null
    };

    console.log('Data to be sent to service:', JSON.stringify(inspectionData, null, 2));

    const result = await dailyCheckService.createIdleInspection(inspectionData);

    res.status(201).json({
      success: true,
      message: "Machine idle status recorded successfully",
      data: result
    });
  } catch (error) {
    console.error('Idle inspection creation error:', {
      message: error.message,
      detail: error.detail,
      code: error.code,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: "Failed to create idle inspection",
      error: error.message,
      details: error.detail || 'No additional details'
    });
  }
};

// API endpoints with auth
const createInspection = async (req, res) => {
  await handleInspectionCreation(req, res);
};

const createIdleInspection = async (req, res) => {
  await handleIdleInspectionCreation(req, res);
};

// Public API endpoints
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