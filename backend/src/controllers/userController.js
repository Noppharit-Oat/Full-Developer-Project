// src/controllers/userController.js

const bcrypt = require("bcryptjs");
const pool = require("../config/database");
const { generateToken } = require("../utils/jwtUtils");

// แก้ไขฟังก์ชัน login
const login = async (req, res) => {
  const { employee_id, password } = req.body;

  // 1. เพิ่มการตรวจสอบข้อมูลเบื้องต้น
  if (!employee_id || !password) {
    return res.status(400).json({
      success: false,
      message: "Employee ID and password are required.",
    });
  }

  try {
    // 2. ปรับ SQL query ให้ใช้ TRIM
    const result = await pool.query(
      'SELECT * FROM "users" WHERE TRIM(employee_id) = TRIM($1)',
      [employee_id]
    );

    const user = result.rows[0];

    // 3. ตรวจสอบว่าพบ user หรือไม่
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid employee ID or password.",
      });
    }

    // 4. ตรวจสอบรหัสผ่านด้วย bcrypt
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid employee ID or password.",
      });
    }

    // 5. สร้าง token
    const token = generateToken({
      employee_id: user.employee_id.trim(),
      role: user.role,
    });

    // 6. อัพเดทเวลา
    await pool.query(
      'UPDATE "users" SET updated_at = CURRENT_TIMESTAMP WHERE TRIM(employee_id) = TRIM($1)',
      [employee_id]
    );

    // 7. ส่งข้อมูลกลับ
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token: token,
      user: {
        employee_id: user.employee_id.trim(),
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number
      }
    });

  } catch (error) {
    // 8. ปรับปรุงการจัดการ error
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during login.",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// ฟังก์ชันการลงทะเบียนผู้ใช้
const register = async (req, res) => {
  const {
    employee_id,
    password,
    role,
    first_name,
    last_name,
    email,
    phone_number,
  } = req.body;

  if (
    !employee_id ||
    !password ||
    !role ||
    !first_name ||
    !last_name ||
    !email
  ) {
    return res
      .status(400)
      .json({ message: "All fields except phone number are required." });
  }

  try {
    const userExists = await pool.query(
      'SELECT * FROM "users" WHERE employee_id = $1 OR email = $2',
      [employee_id, email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: "User with this employee ID or email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO "users" (employee_id, password_hash, role, first_name, last_name, email, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        employee_id,
        hashedPassword,
        role,
        first_name,
        last_name,
        email,
        phone_number,
      ]
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully!",
      token,
      expiresIn: "1h",
      user: {
        employee_id: newUser.employee_id,
        role: newUser.role,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        phone_number: newUser.phone_number,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// ฟังก์ชันการลบผู้ใช้
const deleteUser = async (req, res) => {
  const { employee_id } = req.body;

  if (!employee_id) {
    return res.status(400).json({ message: "Employee ID is required." });
  }

  try {
    const userExists = await pool.query(
      'SELECT * FROM "users" WHERE employee_id = $1',
      [employee_id]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    await pool.query('DELETE FROM "users" WHERE employee_id = $1', [
      employee_id,
    ]);

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error during user deletion:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const updateProfile = async (req, res) => {
  const { employee_id, first_name, last_name, email, phone_number } = req.body;

  if (!employee_id) {
    return res.status(400).json({ message: "Employee ID is required." });
  }

  try {
    const result = await pool.query(
      'UPDATE "users" SET first_name = $1, last_name = $2, email = $3, phone_number = $4 WHERE employee_id = $5 RETURNING *',
      [first_name, last_name, email, phone_number, employee_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// เพิ่มฟังก์ชัน getProfile
const getProfile = async (req, res) => {
  const { employee_id } = req.user; // ได้จาก middleware authenticateToken

  try {
    const result = await pool.query(
      'SELECT employee_id, role, first_name, last_name, email, phone_number FROM "users" WHERE employee_id = $1',
      [employee_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile retrieved successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// แก้ไข module.exports ให้รวม getProfile
module.exports = {
  login,
  register,
  deleteUser,
  updateProfile,
  getProfile,
};
