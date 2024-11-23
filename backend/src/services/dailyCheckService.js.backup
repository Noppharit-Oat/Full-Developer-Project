// src/services/dailyCheckService.js
const pool = require("../config/database");

class DailyCheckService {
  async createInspection(inspections) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const results = [];
      
      // Insert multiple inspection records
      for (const inspection of inspections) {
        const result = await client.query(
          `INSERT INTO inspection_history 
          (machine_name, machine_no, model, customer, family,
           maintenance_type, user_id, checked_at, checklist_item_id,
           status, issue_detail)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *`,
          [
            inspection.machine_name,
            inspection.machine_no,
            inspection.model,
            inspection.customer,
            inspection.family,
            inspection.maintenance_type,
            inspection.user_id,
            inspection.checked_at,
            inspection.checklist_item_id,
            inspection.status,
            inspection.issue_detail
          ]
        );
        
        results.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return results;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async createIdleInspection(data) {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `INSERT INTO inspection_history 
        (machine_name, machine_no, model, customer, family,
         maintenance_type, user_id, checked_at, status, issue_detail)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          data.machine_name,
          data.machine_no,
          data.model,
          data.customer,
          data.family,
          data.maintenance_type,
          data.user_id,
          data.checked_at,
          data.status,
          data.issue_detail
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new DailyCheckService();