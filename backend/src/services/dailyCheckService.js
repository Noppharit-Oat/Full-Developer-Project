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
          (machine_id, machine_name, machine_no, model, customer, family,
           maintenance_type, user_id, checked_at, checklist_item_id,
           status, issue_detail, action_taken, next_check_date, attachments)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING *`,
          [
            null, // machine_id
            inspection.machine_name,
            inspection.machine_no,
            inspection.model,
            inspection.customer,
            inspection.family,
            inspection.maintenance_type || 'daily_check',
            inspection.user_id,
            inspection.checked_at,
            inspection.checklist_item_id,
            inspection.status,
            inspection.issue_detail,
            inspection.action_taken || null,
            inspection.next_check_date || null,
            inspection.attachments || null
          ]
        );
        
        results.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return results;
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Database error in createInspection:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async createIdleInspection(data) {
    const client = await pool.connect();
    
    try {
      console.log('Creating idle inspection with data:', JSON.stringify(data, null, 2));
      
      const result = await client.query(
        `INSERT INTO inspection_history 
        (machine_id, machine_name, machine_no, model, customer, family,
         maintenance_type, user_id, checked_at, status, issue_detail,
         action_taken, next_check_date, attachments)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
        [
          null, // machine_id
          data.machine_name,
          data.machine_no,
          data.model,
          data.customer,
          data.family,
          'mc_idle',
          data.user_id,
          data.checked_at || new Date().toISOString(),
          'idle',
          null, // issue_detail
          data.action_taken || null,
          data.next_check_date || null,
          data.attachments || null
        ]
      );

      console.log('Query result:', JSON.stringify(result.rows[0], null, 2));
      return result.rows[0];
      
    } catch (error) {
      console.error('Database error in createIdleInspection:', {
        message: error.message,
        detail: error.detail,
        code: error.code
      });
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new DailyCheckService();