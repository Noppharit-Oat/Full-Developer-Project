// src/controllers/dailyCheckController.js

const inspectionsService = require("../services/inspectionsService");

const inspectionsController = {
    // ดึงรายการตรวจเช็คทั้งหมด
    async getAllInspections(req, res) {
        try {
            const result = await inspectionsService.getAllInspections();
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // ดึงรายการตรวจเช็คตาม ID
    async getInspectionById(req, res) {
        try {
            const { id } = req.params;
            const result = await inspectionsService.getInspectionById(id);
            if (!result) {
                return res.status(404).json({ message: "Inspection not found" });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // ดึงรายการตรวจเช็คตามเครื่องจักร
    async getInspectionsByMachine(req, res) {
        try {
            const { machine_name } = req.params;
            const result = await inspectionsService.getInspectionsByMachine(machine_name);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // ดึงรายการตรวจเช็คตามสถานะ
    async getInspectionsByStatus(req, res) {
        try {
            const { status } = req.params;
            const result = await inspectionsService.getInspectionsByStatus(status);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // สร้างรายการตรวจเช็คใหม่
    async createInspection(req, res) {
        try {
            const inspectionData = req.body;
            // เพิ่ม user ID จาก token
            inspectionData.checked_by = req.user.employee_id;
            const result = await inspectionsService.createInspection(inspectionData);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // อัพเดทรายการตรวจเช็ค
    async updateInspection(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const result = await inspectionsService.updateInspection(id, updateData);
            if (!result) {
                return res.status(404).json({ message: "Inspection not found" });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // อัพเดทสถานะ
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await inspectionsService.updateStatus(id, status);
            if (!result) {
                return res.status(404).json({ message: "Inspection not found" });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // ลบรายการตรวจเช็ค
    async deleteInspection(req, res) {
        try {
            const { id } = req.params;
            await inspectionsService.deleteInspection(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // อัพโหลดไฟล์แนบ
    async uploadAttachments(req, res) {
        try {
            const { id } = req.params;
            const files = req.files;
            const result = await inspectionsService.uploadAttachments(id, files);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = inspectionsController;