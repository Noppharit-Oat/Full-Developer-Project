// src/app/main-menu/machine-down/page.jsx

"use client";

import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../components/DarkModeProvider";
import QrScanner from "@/app/components/QrScanner";
import { AlertTriangle, Clock } from "lucide-react";

function MachineDownPage() {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  const [machineName, setMachineName] = useState("");
  const [machineNo, setMachineNo] = useState("");
  const [machineModel, setMachineModel] = useState(""); // เพิ่ม state สำหรับ Model
  const [machineCustomer, setMachineCustomer] = useState(""); // เพิ่ม state สำหรับ Customer
  const [problemType, setProblemType] = useState("");
  const [problemDetail, setProblemDetail] = useState("");
  const [error, setError] = useState(null);

  // Mock Data
  const mockData = {
    problemTypes: [
      "Mechanical Issue",
      "Electrical Issue",
      "Software Issue",
      "Calibration Required",
      "Maintenance Required",
      "Other",
    ],
  };

  // Styling classes
  const cardClass = `p-6 rounded-lg shadow-md ${
    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;

  const buttonClass = `px-4 py-2 rounded-md text-white ${
    darkMode
      ? "bg-indigo-600 hover:bg-indigo-700"
      : "bg-blue-600 hover:bg-blue-700"
  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`;

  const inputClass = `w-full px-3 py-2 border rounded-md ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-gray-100 border-gray-300 text-gray-900"
  } focus:outline-none cursor-not-allowed`;

  const selectClass = `w-full px-3 py-2 border rounded-md ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300 text-gray-900"
  } focus:outline-none focus:ring-2 focus:ring-indigo-500`;

  const textareaClass = `w-full px-3 py-2 border rounded-md ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300 text-gray-900"
  } focus:outline-none focus:ring-2 focus:ring-indigo-500`;

  const handleQrCodeScanned = (scannedData) => {
    try {
      const pattern =
        /Machine Name: \[(.*?)\] ,Machine No: \[(.*?)\] ,Model: \[(.*?)\] ,Customer: \[(.*?)\]/i;
      const matches = scannedData.match(pattern);

      if (matches && matches.length === 5) {
        const [_, name, no, model, customer] = matches;
        setMachineName(name.toLowerCase());
        setMachineNo(no);
        setMachineModel(model);
        setMachineCustomer(customer);
        setError(null);
      } else {
        setError(new Error("Invalid QR code format"));
      }
    } catch (err) {
      setError(new Error("Error processing QR code"));
    }
  };

  const handleSubmit = async () => {
    const report = {
      machineName,
      machineNo,
      machineModel,
      machineCustomer,
      problemType,
      problemDetail,
      reportedBy: user?.id,
      timestamp: new Date().toISOString(),
      status: "pending",
    };
    console.log("Submitting machine down report:", report);
    // TODO: API call to submit report
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"} p-8`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <AlertTriangle
              className={`w-8 h-8 ${
                darkMode ? "text-red-400" : "text-red-500"
              }`}
            />
            <h2
              className={`text-3xl font-extrabold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Machine Down Report
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <Clock className="w-6 h-6" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Report Form */}
        <div className={cardClass}>
          <div className="space-y-6">
            {/* Machine Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Machine Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Machine Name:
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={machineName}
                  placeholder="Machine name will appear after scan"
                  readOnly
                />
              </div>

              {/* Machine No */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Machine No:
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={machineNo}
                  placeholder="Machine number will appear after scan"
                  readOnly
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium mb-2">Model:</label>
                <input
                  type="text"
                  className={inputClass}
                  value={machineModel}
                  placeholder="Model will appear after scan"
                  readOnly
                />
              </div>

              {/* Customer */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer:
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={machineCustomer}
                  placeholder="Customer will appear after scan"
                  readOnly
                />
              </div>
            </div>

            {/* QR Scanner */}
            <div className="flex justify-center">
              <QrScanner
                onScanSuccess={handleQrCodeScanned}
                buttonText="Scan QR Code"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
                <p>Error: {error.message}</p>
              </div>
            )}

            {/* Problem Details */}
            <div className="space-y-4">
              {/* Problem Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Problem Type:
                </label>
                <select
                  className={selectClass}
                  value={problemType}
                  onChange={(e) => setProblemType(e.target.value)}
                >
                  <option value="">Select Problem Type</option>
                  {mockData.problemTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Problem Detail */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Problem Details:
                </label>
                <textarea
                  className={textareaClass}
                  value={problemDetail}
                  onChange={(e) => setProblemDetail(e.target.value)}
                  rows="4"
                  placeholder="Enter detailed description of the problem..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className={`${buttonClass} w-full`}
              disabled={
                !machineName || !machineNo || !problemType || !problemDetail
              }
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MachineDownPage;
