// src/services/userService.js

const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const findUserByEmployeeId = async (employeeId) => {
  const result = await pool.query('SELECT * FROM "Users" WHERE employee_id = $1', [employeeId]);
  return result.rows[0];
};

const createUser = async (userData) => {
  const { employee_id, password, role, first_name, last_name, email, phone_number } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const result = await pool.query(
    'INSERT INTO "Users" (employee_id, password_hash, role, first_name, last_name, email, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [employee_id, hashedPassword, role, first_name, last_name, email, phone_number]
  );
  
  return result.rows[0];
};

const validatePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  findUserByEmployeeId,
  createUser,
  validatePassword
};