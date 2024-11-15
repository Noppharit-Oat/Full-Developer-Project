// src/services/machineService.js
const pool = require("../config/database");

class MachineService {
  async getAllMachines() {
    const result = await pool.query(
      "SELECT * FROM machines ORDER BY machine_id"
    );
    return result.rows;
  }

  // ดึงข้อมูลเครื่องจักรตาม ID
  async getMachineById(id) {
    const result = await pool.query(
      "SELECT * FROM machines WHERE machine_id = $1",
      [id]
    );
    return result.rows[0];
  }

  // เพิ่มเครื่องจักรใหม่
  async createMachine(machineData) {
    const {
      machine_name,
      machine_type,
      location,
      manufacturer,
      model,
      serial_number,
      installation_date,
      last_maintenance_date,
      next_maintenance_date,
      status,
      notes,
    } = machineData;

    const result = await pool.query(
      `INSERT INTO machines (
                machine_name, machine_type, location, manufacturer,
                model, serial_number, installation_date,
                last_maintenance_date, next_maintenance_date,
                status, notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        machine_name,
        machine_type,
        location,
        manufacturer,
        model,
        serial_number,
        installation_date,
        last_maintenance_date,
        next_maintenance_date,
        status,
        notes,
      ]
    );
    return result.rows[0];
  }

  // อัพเดตข้อมูลเครื่องจักร
  async updateMachine(id, machineData) {
    const {
      machine_name,
      machine_type,
      location,
      manufacturer,
      model,
      serial_number,
      installation_date,
      last_maintenance_date,
      next_maintenance_date,
      status,
      notes,
    } = machineData;

    const result = await pool.query(
      `UPDATE machines SET
                machine_name = $1,
                machine_type = $2,
                location = $3,
                manufacturer = $4,
                model = $5,
                serial_number = $6,
                installation_date = $7,
                last_maintenance_date = $8,
                next_maintenance_date = $9,
                status = $10,
                notes = $11,
                updated_at = CURRENT_TIMESTAMP
            WHERE machine_id = $12 RETURNING *`,
      [
        machine_name,
        machine_type,
        location,
        manufacturer,
        model,
        serial_number,
        installation_date,
        last_maintenance_date,
        next_maintenance_date,
        status,
        notes,
        id,
      ]
    );
    return result.rows[0];
  }

  // ลบเครื่องจักร
  async deleteMachine(id) {
    const result = await pool.query(
      "DELETE FROM machines WHERE machine_id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  // ตรวจสอบว่าเครื่องจักรมีอยู่หรือไม่
  async checkMachineExists(id) {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM machines WHERE machine_id = $1)",
      [id]
    );
    return result.rows[0].exists;
  }

  // ค้นหาเครื่องจักรตามเงื่อนไข
  async searchMachines(searchCriteria) {
    const conditions = [];
    const values = [];
    let valueCount = 1;

    if (searchCriteria.machine_name) {
      conditions.push(`machine_name ILIKE $${valueCount}`);
      values.push(`%${searchCriteria.machine_name}%`);
      valueCount++;
    }

    if (searchCriteria.machine_type) {
      conditions.push(`machine_type = $${valueCount}`);
      values.push(searchCriteria.machine_type);
      valueCount++;
    }

    if (searchCriteria.location) {
      conditions.push(`location = $${valueCount}`);
      values.push(searchCriteria.location);
      valueCount++;
    }

    if (searchCriteria.status) {
      conditions.push(`status = $${valueCount}`);
      values.push(searchCriteria.status);
      valueCount++;
    }

    const query = `
            SELECT * FROM machines
            ${conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""}
            ORDER BY machine_id
        `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  // ดึงข้อมูลการบำรุงรักษาที่กำลังจะถึง
  async getUpcomingMaintenance(days = 7) {
    const result = await pool.query(
      `SELECT * FROM machines 
            WHERE next_maintenance_date IS NOT NULL 
            AND next_maintenance_date <= CURRENT_DATE + $1
            ORDER BY next_maintenance_date`,
      [days]
    );
    return result.rows;
  }
}

module.exports = new MachineService();
