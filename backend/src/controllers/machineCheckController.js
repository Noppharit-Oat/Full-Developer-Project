// src/controllers/machineCheckController.js
const machineCheckService = require("../services/machineCheckService");

class MachineCheckController {
  async getChecklist(frequency) {
    try {
      const checklist = await machineCheckService.getChecklist(frequency);
      return { success: true, data: checklist };
    } catch (error) {
      console.error("Error in getChecklist:", error);
      throw new Error(error.message);
    }
  }

  async saveCheckResult(checkData) {
    try {
      const checkRecordId = await machineCheckService.saveCheckResult(
        checkData
      );
      return {
        success: true,
        message: "บันทึกผลการตรวจเช็คเรียบร้อย",
        checkRecordId,
      };
    } catch (error) {
      console.error("Error in saveCheckResult:", error);
      throw new Error(error.message);
    }
  }

  async getCheckHistory(machineId, startDate, endDate) {
    try {
      const history = await machineCheckService.getCheckHistory(
        machineId,
        startDate,
        endDate
      );
      return { success: true, data: history };
    } catch (error) {
      console.error("Error in getCheckHistory:", error);
      throw new Error(error.message);
    }
  }
}

module.exports = new MachineCheckController();
