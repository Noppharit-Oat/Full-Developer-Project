// src/services/dailyCheckService.js

const db = require("../config/database");

const inspectionsService = {
    // ดึงรายการตรวจเช็คทั้งหมด
    async getAllInspections() {
        const query = `
            SELECT i.*, ia.file_path, ia.file_name
            FROM inspection_history i
            LEFT JOIN inspection_attachments ia ON i.id = ia.inspection_id
            ORDER BY i.created_at DESC
        `;
        const result = await db.query(query);
        return result.rows;
    },

    // ดึงรายการตรวจเช็คตาม ID
    async getInspectionById(id) {
        const query = `
            SELECT i.*, ia.file_path, ia.file_name
            FROM inspection_history i
            LEFT JOIN inspection_attachments ia ON i.id = ia.inspection_id
            WHERE i.id = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    },

    // ดึงรายการตรวจเช็คตามเครื่องจักร
    async getInspectionsByMachine(machine_name) {
        const query = `
            SELECT i.*, ia.file_path, ia.file_name
            FROM inspection_history i
            LEFT JOIN inspection_attachments ia ON i.id = ia.inspection_id
            WHERE i.machine_name = $1
            ORDER BY i.created_at DESC
        `;
        const result = await db.query(query, [machine_name]);
        return result.rows;
    },

    // ดึงรายการตรวจเช็คตามสถานะ
    async getInspectionsByStatus(status) {
        const query = `
            SELECT i.*, ia.file_path, ia.file_name
            FROM inspection_history i
            LEFT JOIN inspection_attachments ia ON i.id = ia.inspection_id
            WHERE i.status = $1
            ORDER BY i.created_at DESC
        `;
        const result = await db.query(query, [status]);
        return result.rows;
    },

    // สร้างรายการตรวจเช็คใหม่
    async createInspection(inspectionData) {
        const {
            machine_name, machine_no, model, customer, family,
            status, checked_by, group_id, checklist_item_id,
            issue_detail, action_taken, maintenance_type, next_check_date
        } = inspectionData;

        const query = `
            INSERT INTO inspection_history (
                machine_name, machine_no, model, customer, family,
                status, checked_by, group_id, checklist_item_id,
                issue_detail, action_taken, maintenance_type, next_check_date
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *
        `;

        const result = await db.query(query, [
            machine_name, machine_no, model, customer, family,
            status, checked_by, group_id, checklist_item_id,
            issue_detail, action_taken, maintenance_type, next_check_date
        ]);

        return result.rows[0];
    },

    // อัพเดทรายการตรวจเช็ค
    async updateInspection(id, updateData) {
        const {
            status, issue_detail, action_taken,
            maintenance_type, next_check_date
        } = updateData;

        const query = `
            UPDATE inspection_history
            SET status = $1,
                issue_detail = $2,
                action_taken = $3,
                maintenance_type = $4,
                next_check_date = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *
        `;

        const result = await db.query(query, [
            status, issue_detail, action_taken,
            maintenance_type, next_check_date, id
        ]);

        return result.rows[0];
    },

    // อัพเดทสถานะ
    async updateStatus(id, status) {
        const query = `
            UPDATE inspection_history
            SET status = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        const result = await db.query(query, [status, id]);
        return result.rows[0];
    },

    // ลบรายการตรวจเช็ค
    async deleteInspection(id) {
        const query = `DELETE FROM inspection_history WHERE id = $1`;
        await db.query(query, [id]);
    },

    // อัพโหลดไฟล์แนบ
    async uploadAttachments(inspectionId, files) {
        const values = files.map(file => {
            return `(${inspectionId}, '${file.path}', '${file.filename}', '${file.mimetype}')`;
        }).join(',');

        const query = `
            INSERT INTO inspection_attachments (inspection_id, file_path, file_name, file_type)
            VALUES ${values}
            RETURNING *
        `;

        const result = await db.query(query);
        return result.rows;
    }
};

module.exports = inspectionsService;