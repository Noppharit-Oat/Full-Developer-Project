const dailyCheckService = require("../services/dailyCheckService");

function createDailyCheck(req, res) {
  const checkData = {
    ...req.body,
    user_id: req.user?.id,
  };

  if (!checkData.machine_no || !checkData.machine_name) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

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
        error: error.message,
      });
    });
}

function getDailyCheckHistory(req, res) {
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
        count: history.length,
      });
    })
    .catch(error => {
      console.error("Error fetching daily check history:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch daily check history",
        error: error.message,
      });
    });
}

module.exports = {
  createDailyCheck,
  getDailyCheckHistory
};