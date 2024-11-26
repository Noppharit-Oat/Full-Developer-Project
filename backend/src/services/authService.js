// src/services/authService.js
const db = require("../config/database");
const { generateToken, verifyToken } = require("../utils/jwtUtils");

const authService = {
  async validateUser(employee_id, password) {
    try {
      // ตรวจสอบว่าพบ user หรือไม่
      const result = await db.query(
        "SELECT id, employee_id, password, role FROM users WHERE employee_id = $1",
        [employee_id]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          message: "รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง",
        };
      }

      const user = result.rows[0];

      // ตรวจสอบรหัสผ่าน (ยังไม่ได้ใช้ bcrypt)
      if (password !== user.password) {
        return {
          success: false,
          message: "รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง",
        };
      }

      // สร้าง token
      const token = generateToken({
        id: user.id,
        employee_id: user.employee_id,
        role: user.role,
      });

      // อัพเดท last_login
      await db.query(
        "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
        [user.id]
      );

      // ส่งข้อมูลกลับ
      return {
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            employee_id: user.employee_id,
            role: user.role,
          },
        },
      };
    } catch (error) {
      console.error("Auth service validateUser error:", error);
      throw new Error("เกิดข้อผิดพลาดในการตรวจสอบข้อมูล");
    }
  },

  async verifyUser(userId) {
    try {
      const result = await db.query(
        "SELECT id, employee_id, role FROM users WHERE id = $1",
        [userId]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          message: "ไม่พบข้อมูลผู้ใช้",
        };
      }

      return {
        success: true,
        data: {
          user: result.rows[0],
        },
      };
    } catch (error) {
      console.error("Auth service verifyUser error:", error);
      throw new Error("เกิดข้อผิดพลาดในการตรวจสอบข้อมูลผู้ใช้");
    }
  },

  async getUser(userId) {
    try {
      const result = await db.query(
        `SELECT 
          u.id, 
          u.employee_id, 
          u.role,
          u.created_at,
          u.last_login
        FROM users u
        WHERE u.id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          message: "ไม่พบข้อมูลผู้ใช้",
        };
      }

      return {
        success: true,
        data: {
          user: result.rows[0],
        },
      };
    } catch (error) {
      console.error("Auth service getUser error:", error);
      throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
    }
  },

  async refreshToken(refreshToken) {
    try {
      // ตรวจสอบ refresh token
      const decoded = verifyToken(refreshToken);

      if (!decoded || !decoded.id) {
        return {
          success: false,
          message: "Invalid refresh token",
        };
      }

      // ตรวจสอบว่า user ยังมีอยู่ในระบบ
      const result = await db.query(
        "SELECT id, employee_id, role FROM users WHERE id = $1",
        [decoded.id]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          message: "User not found",
        };
      }

      const user = result.rows[0];

      // สร้าง token ใหม่
      const newToken = generateToken({
        id: user.id,
        employee_id: user.employee_id,
        role: user.role,
      });

      return {
        success: true,
        data: {
          token: newToken,
          user: {
            id: user.id,
            employee_id: user.employee_id,
            role: user.role,
          },
        },
      };
    } catch (error) {
      console.error("Auth service refreshToken error:", error);
      throw new Error("เกิดข้อผิดพลาดในการต่ออายุ token");
    }
  },
};

module.exports = authService;
