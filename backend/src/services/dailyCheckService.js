// src/controllers/dailyCheckController.js
const dailyCheckService = require("../services/dailyCheckService");

exports.createDailyCheck = function(req, res) {
  const checkData = {
    ...req.body,
    user_id: req.user?.id,
  };

  dailyCheckService.createDailyCheck(checkData)
    .then(result => {
      res.status(201).json({
        success: true,
        message: checkData.maintenance_type === "mc_idle"
          ? "Machine idle status recorded successfully"
          : "Daily check recorded successfully",
        data: result,
      });
    })
    .catch(error => {
      console.error("Error creating daily check record:", error);
      res.status(500).json({
        success: false,
        message: "Failed to record daily check",
      });
    });
};

exports.getDailyCheckHistory = function(req, res) {
  const { machine_no, date } = req.query;

  if (!machine_no) {
    return res.status(400).json({
      success: false,
      message: "Machine number is required",
    });
  }

  const filters = {
    machine_no,
    date: date || new Date().toISOString().split("T")[0],
  };

  dailyCheckService.getDailyCheckHistory(filters)
    .then(history => {
      res.json({
        success: true,
        data: history,
      });
    })
    .catch(error => {
      console.error("Error fetching daily check history:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch daily check history",
      });
    });
};