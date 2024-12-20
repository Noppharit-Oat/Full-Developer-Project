const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const users = [
  { employee_id: '073736', password: '73736', role: 6, first_name: 'Noppharit', last_name: 'Sriwichai', email: 'Noppharit.S@lpn.hanabk.th.com', phone_number: '424' },
  { employee_id: '011111', password: '11111', role: 1, first_name: 'User1', last_name: 'User1', email: '12gh.cc', phone_number: '1234' },
  { employee_id: '022222', password: '22222', role: 2, first_name: 'Supervisor2', last_name: 'Supervisor2', email: 'Supervisor.2@lpn.hanabk.th.com', phone_number: '314' },
  { employee_id: '033333', password: '33333', role: 3, first_name: 'Technician3', last_name: 'Technician3', email: 'Technician.3@lpn.hanabk.th.com', phone_number: '512' },
  { employee_id: '044444', password: '44444', role: 4, first_name: 'Super User4', last_name: 'Super User4', email: 'Super User.4@lpn.hanabk.th.com', phone_number: '312' },
  { employee_id: '055555', password: '55555', role: 5, first_name: 'Super Technician5', last_name: 'Super Technician5', email: 'Super Technician.5@lpn.hanabk.th.com', phone_number: '123' },
  { employee_id: '066666', password: '66666', role: 6, first_name: 'Super SS6', last_name: 'Super PP6', email: 'Super SSPP6@lpn.hanabk.th.com', phone_number: '456' }
];

async function insertUsers() {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    // กำหนดค่า email และ phone_number ให้เป็น NULL หาก role = 1
    const email = (user.role === 1) ? null : user.email;
    const phone_number = (user.role === 1) ? null : user.phone_number;
    
    try {
      await pool.query(
        'INSERT INTO "users" (employee_id, password, role, first_name, last_name, email, phone_number, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
        [user.employee_id, hashedPassword, user.role, user.first_name, user.last_name, email, phone_number]
      );
      console.log(`Inserted user: ${user.employee_id}`);
    } catch (error) {
      console.error(`Error inserting user ${user.employee_id}:`, error);
    }
  }
  await pool.end();
}

insertUsers().then(() => console.log('All users inserted'));
