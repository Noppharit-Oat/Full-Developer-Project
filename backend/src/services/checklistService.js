// src/services/checklistService.js
const pool = require("../config/database");

class ChecklistService {
  // Checklist Groups
  async getAllChecklistGroups() {
    const result = await pool.query(
      "SELECT * FROM checklist_groups ORDER BY id"
    );
    return result.rows;
  }

  async getChecklistGroupById(id) {
    const result = await pool.query(
      "SELECT * FROM checklist_groups WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  async createChecklistGroup(data) {
    const { name, thai_name } = data;
    const result = await pool.query(
      "INSERT INTO checklist_groups (name, thai_name) VALUES ($1, $2) RETURNING *",
      [name, thai_name]
    );
    return result.rows[0];
  }

  async updateChecklistGroup(id, data) {
    const { name, thai_name } = data;
    const result = await pool.query(
      "UPDATE checklist_groups SET name = $1, thai_name = $2 WHERE id = $3 RETURNING *",
      [name, thai_name, id]
    );
    return result.rows[0];
  }

  async deleteChecklistGroup(id) {
    const result = await pool.query(
      "DELETE FROM checklist_groups WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  // Model Checklist Items
  async getAllModelChecklistItems() {
    const result = await pool.query(`
            SELECT mci.*, cg.name as group_name, cg.thai_name as group_thai_name 
            FROM model_checklist_items mci 
            LEFT JOIN checklist_groups cg ON mci.group_id = cg.id 
            ORDER BY mci.id
        `);
    return result.rows;
  }

  async getModelChecklistItemById(id) {
    const result = await pool.query(
      `
            SELECT mci.*, cg.name as group_name, cg.thai_name as group_thai_name 
            FROM model_checklist_items mci 
            LEFT JOIN checklist_groups cg ON mci.group_id = cg.id 
            WHERE mci.id = $1
        `,
      [id]
    );
    return result.rows[0];
  }

  async createModelChecklistItem(data) {
    const {
      group_id,
      machine_name,
      model,
      item_name,
      item_thai_name,
      frequency,
    } = data;

    const result = await pool.query(
      `INSERT INTO model_checklist_items 
            (group_id, machine_name, model, item_name, item_thai_name, frequency) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
      [group_id, machine_name, model, item_name, item_thai_name, frequency]
    );
    return result.rows[0];
  }

  async updateModelChecklistItem(id, data) {
    const {
      group_id,
      machine_name,
      model,
      item_name,
      item_thai_name,
      frequency,
    } = data;

    const result = await pool.query(
      `UPDATE model_checklist_items 
            SET group_id = $1, machine_name = $2, model = $3, 
                item_name = $4, item_thai_name = $5, frequency = $6 
            WHERE id = $7 
            RETURNING *`,
      [group_id, machine_name, model, item_name, item_thai_name, frequency, id]
    );
    return result.rows[0];
  }

  async deleteModelChecklistItem(id) {
    const result = await pool.query(
      "DELETE FROM model_checklist_items WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  // Inspection History
  async createInspectionHistory(data) {
    const {
      machine_id,
      checklist_item_id,
      user_id,
      machine_name,
      machine_no,
      model,
      customer,
      family,
      status,
      issue_detail,
    } = data;

    const result = await pool.query(
      `INSERT INTO inspection_history 
            (machine_id, checklist_item_id, user_id, machine_name, machine_no, 
             model, customer, family, status, issue_detail) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
      [
        machine_id,
        checklist_item_id,
        user_id,
        machine_name,
        machine_no,
        model,
        customer,
        family,
        status,
        issue_detail,
      ]
    );
    return result.rows[0];
  }

  async getInspectionHistory(filters = {}) {
    let query = `
            SELECT ih.*, 
                   u.first_name, u.last_name,
                   mci.item_name, mci.item_thai_name, mci.frequency
            FROM inspection_history ih
            LEFT JOIN users u ON ih.user_id = u.employee_id
            LEFT JOIN model_checklist_items mci ON ih.checklist_item_id = mci.id
            WHERE 1=1
        `;
    const values = [];
    let valueIndex = 1;

    if (filters.machine_id) {
      query += ` AND ih.machine_id = $${valueIndex}`;
      values.push(filters.machine_id);
      valueIndex++;
    }

    if (filters.user_id) {
      query += ` AND ih.user_id = $${valueIndex}`;
      values.push(filters.user_id);
      valueIndex++;
    }

    if (filters.status) {
      query += ` AND ih.status = $${valueIndex}`;
      values.push(filters.status);
      valueIndex++;
    }

    if (filters.start_date) {
      query += ` AND ih.checked_at >= $${valueIndex}`;
      values.push(filters.start_date);
      valueIndex++;
    }

    if (filters.end_date) {
      query += ` AND ih.checked_at <= $${valueIndex}`;
      values.push(filters.end_date);
      valueIndex++;
    }

    query += " ORDER BY ih.checked_at DESC";

    const result = await pool.query(query, values);
    return result.rows;
  }

  async getChecklistByParams(frequency, machineName, model) {
    try {
        console.log("Input Parameters:", { frequency, machineName, model });

        const result = await pool.query(
            `
            SELECT 
                mci.*,
                cg.name as group_name,
                cg.thai_name as group_thai_name 
            FROM model_checklist_items mci 
            LEFT JOIN checklist_groups cg ON mci.group_id = cg.id 
            WHERE mci.frequency = $1 
            AND mci.machine_name = $2 
            AND mci.model = $3
            AND mci.is_active = true
            ORDER BY 
                mci.group_id ASC,
                mci.id ASC
            `,
            [frequency, machineName, model]
        );

        // จัดกลุ่มข้อมูลตาม group
        const groupedItems = result.rows.reduce((acc, item) => {
            const groupKey = item.group_id;
            if (!acc[groupKey]) {
                acc[groupKey] = {
                    group: {
                        id: item.group_id,
                        name: item.group_name,
                        thai_name: item.group_thai_name
                    },
                    items: []
                };
            }

            acc[groupKey].items.push({
                id: item.id,
                item_name: item.item_name,
                item_thai_name: item.item_thai_name,
                maintenance_type: item.maintenance_type,
                frequency: item.frequency
            });

            return acc;
        }, {});

        // แปลงจาก object เป็น array
        const formattedResult = Object.values(groupedItems);

        console.log("Formatted Result:", formattedResult);

        return {
            total: result.rows.length,
            groups: formattedResult
        };

    } catch (error) {
        console.error("Error in getChecklistByParams:", error);
        throw error;
    }
  }
}

module.exports = new ChecklistService();