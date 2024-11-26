// src/controllers/authController.js
const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    try {
      const { employee_id, password } = req.body;
      if (!employee_id || !password) {
        return res.status(400).json({
          success: false,
          message: 'กรุณากรอกรหัสพนักงานและรหัสผ่าน'
        });
      }
      const result = await authService.validateUser(employee_id, password);
      if (!result.success) {
        return res.status(401).json({
          success: false,
          message: result.message
        });
      }
      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง'
      });
    }
  }

  async verify(req, res) {
    try {
      const result = await authService.verifyUser(req.user.id);
      if (!result.success) {
        return res.status(401).json({
          success: false,
          message: result.message
        });
      }
      res.json(result);
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล'
      });
    }
  }

  async getUser(req, res) {
    try {
      const result = await authService.getUser(req.user.id);
      res.json(result);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
      });
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }
      const result = await authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการต่ออายุ token'
      });
    }
  }
}

module.exports = new AuthController();