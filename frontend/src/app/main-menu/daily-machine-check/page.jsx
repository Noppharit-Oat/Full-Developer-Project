// src/app/main-menu/daily-machine-check/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../components/DarkModeProvider";
import QrScanner from "@/app/components/QrScanner";
import {
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  CalendarCheck,
} from "lucide-react";

function MachineDailyCheckPage() {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  const [machineName, setMachineName] = useState("");
  const [machineNo, setMachineNo] = useState("");
  const [machineModel, setMachineModel] = useState("");
  const [machineCustomer, setMachineCustomer] = useState("");
  const [error, setError] = useState(null);
  const [checkData, setCheckData] = useState({
    checklist: [],
  });

  // Mock Data
  const mockData = {
    checklist: [
      { id: 1, item: "Oil Level Check", status: null },
      { id: 2, item: "Pressure Check", status: null },
      { id: 3, item: "Temperature Check", status: null },
      { id: 4, item: "Safety Guards Check", status: null },
      { id: 5, item: "Emergency Stop Test", status: null },
    ],
  };

  useEffect(() => {
    setCheckData({
      checklist: mockData.checklist,
    });
  }, []);

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

  const handleStatusChange = (itemId, status) => {
    setCheckData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === itemId ? { ...item, status } : item
      ),
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting check data:", {
      machineName,
      machineNo,
      machineModel,
      machineCustomer,
      checklist: checkData.checklist,
      timestamp: new Date().toISOString(),
      userId: user?.id,
    });
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"} p-8`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <ClipboardCheck
              className={`w-8 h-8 ${
                darkMode ? "text-indigo-400" : "text-indigo-500"
              }`}
            />
            <h2
              className={`text-3xl font-extrabold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Daily Machine Check
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <CalendarCheck className="w-6 h-6" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Machine Selection and Check Form */}
        <div className={cardClass}>
          <h3 className="text-xl font-bold mb-4">Inspection Checklist</h3>

          {/* Machine Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

          {/* Center QR Scanner */}
          <div className="flex justify-center mt-4">
            <QrScanner
              onScanSuccess={handleQrCodeScanned}
              buttonText="Scan QR Code"
            />
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
              <p>Error: {error.message}</p>
            </div>
          )}

          {/* Checklist */}
          <div className="space-y-4 mt-6">
            {checkData.checklist.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{item.item}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(item.id, "pass")}
                      className={`p-2 rounded-md ${
                        item.status === "pass"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(item.id, "fail")}
                      className={`p-2 rounded-md ${
                        item.status === "fail"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {item.status === "fail" && (
                  <textarea
                    placeholder="Enter issue details..."
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-2`}
                    rows="2"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className={`${buttonClass} w-full mt-6`}
            disabled={!machineName || !machineNo}
          >
            Submit Check
          </button>
        </div>
      </div>
    </div>
  );
}

export default MachineDailyCheckPage;
