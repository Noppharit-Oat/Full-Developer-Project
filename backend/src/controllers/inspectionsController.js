// src/controllers/inspectionsController.js

const inspectionsService = require("../services/inspectionsService");

const inspectionsController = {
  // ดึงรายการตรวจเช็คทั้งหมด
  async getAllInspections(req, res) {
    try {
      const result = await inspectionsService.getAllInspections();
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error getting inspections:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Could not get inspections",
      });
    }
  },

  // ดึงรายการตรวจเช็คตาม ID
  async getInspectionById(req, res) {
    try {
      const { id } = req.params;
      const result = await inspectionsService.getInspectionById(id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Inspection not found",
        });
      }
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error getting inspection by ID:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Could not get inspection",
      });
    }
  },

  // ดึงรายการตรวจเช็คตามเครื่องจักร
  async getInspectionsByMachine(req, res) {
    try {
      const { machine_name } = req.params;
      const result = await inspectionsService.getInspectionsByMachine(
        machine_name
      );
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error getting inspections by machine:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Could not get machine inspections",
      });
    }
  },

  // ดึงรายการตรวจเช็คตามสถานะ
  async getInspectionsByStatus(req, res) {
    try {
      const { status } = req.params;
      const result = await inspectionsService.getInspectionsByStatus(status);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error getting inspections by status:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Could not get status inspections",
      });
    }
  },

  // สร้างรายการตรวจเช็คใหม่
  async createInspection(req, res) {
    try {
      console.log("Creating new inspection:", req.body);

      const {
        machine_name,
        machine_no,
        model,
        customer,
        family,
        status,
        checked_by,
      } = req.body;

      // Validate required fields
      if (!machine_name || !machine_no || !family || !status || !checked_by) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Validate status
      const validStatuses = ["Pass", "Fail", "Idle"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value",
        });
      }

      // สร้าง inspection data โดยส่งค่าตามที่รับมาจริงๆ
      const inspectionData = {
        machine_name,
        machine_no,
        model,
        customer,
        family,
        status,
        checked_by,
      };

      const result = await inspectionsService.createInspection(inspectionData);

      console.log("Inspection created:", result);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error creating inspection:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Could not create inspection",
      });
    }
  },

  // อัพเดทรายการตรวจเช็ค
  async updateInspection(req, res) {
    try {
      const { id } = req.params;
      const {
        status,
        issue_detail,
        action_taken,
        maintenance_type,
        next_check_date,
      } = req.body;

      // Validate required fields
      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      // Validate status
      const validStatuses = ["Pass", "Fail", "Idle"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value",
        });
      }

      const updateData = {
        status,
        issue_detail,
        action_taken,
        maintenance_type,
        next_check_date,
      };

      const result = await inspectionsService.updateInspection(id, updateData);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Inspection not found",
        });
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error updating inspection:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Could not update inspection",
      });
    }
  },

  // อัพเดทสถานะ
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const result = await inspectionsService.updateStatus(id, status);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Inspection not found",
        });
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Could not update status",
      });
    }
  },

  // ลบรายการตรวจเช็ค
  async deleteInspection(req, res) {
    try {
      const { id } = req.params;
      await inspectionsService.deleteInspection(id);
      res.json({
        success: true,
        message: "Inspection deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting inspection:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Could not delete inspection",
      });
    }
  },

  // อัพโหลดไฟล์แนบ
  async uploadAttachments(req, res) {
    try {
      const { id } = req.params;
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const result = await inspectionsService.uploadAttachments(id, files);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error uploading attachments:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Could not upload attachments",
      });
    }
  },

  // ดึงประวัติการตรวจเช็ค
  async getInspectionHistory(req, res) {
    try {
      const { machine_name, start_date, end_date } = req.query;
      const options = {
        machine_name,
        start_date,
        end_date,
      };
      const result = await inspectionsService.getInspectionHistory(options);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error getting inspection history:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Could not get inspection history",
      });
    }
  },

  // ดึงสถิติการตรวจเช็ค
  async getInspectionStats(req, res) {
    try {
      const { start_date, end_date } = req.query;
      const result = await inspectionsService.getInspectionStats({
        start_date,
        end_date,
      });
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error getting inspection stats:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Could not get inspection statistics",
      });
    }
  },
};

module.exports = inspectionsController;
