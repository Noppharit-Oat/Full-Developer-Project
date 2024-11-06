// src/app/main-menu/daily-machine-check/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../components/DarkModeProvider";
import QrScanner from "../../components/QrScanner";
import {
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  CalendarCheck,
  Plus,
  Trash2,
} from "lucide-react";

function MachineDailyCheckPage() {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  const [machineName, setMachineName] = useState("");
  const [machineNo, setMachineNo] = useState("");
  const [newMachineName, setNewMachineName] = useState("");
  const [showNewMachineInput, setShowNewMachineInput] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState(null);
  const [checkData, setCheckData] = useState({
    checklist: [],
  });
  const [error, setError] = useState(null);

  // Mock Data
  const mockData = {
    machineNames: [],
    checklist: [
      { id: 1, item: "Oil Level Check", status: null },
      { id: 2, item: "Pressure Check", status: null },
      { id: 3, item: "Temperature Check", status: null },
      { id: 4, item: "Safety Guards Check", status: null },
      { id: 5, item: "Emergency Stop Test", status: null },
    ],
  };

  const [availableMachineNames, setAvailableMachineNames] = useState(
    mockData.machineNames
  );

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
      : "bg-white border-gray-300 text-gray-900"
  } focus:outline-none focus:ring-2 focus:ring-indigo-500`;

  const handleQrCodeScanned = (scannedData) => {
    try {
      const matches = scannedData.match(
        /Machine Name\s*:\s*(\w+)\s*Machine No\s*:\s*(\d+)/i
      );

      if (matches && matches.length === 3) {
        const [_, name, no] = matches;
        setMachineName(name.toLowerCase());
        setMachineNo(no);
        setError(null);

        // Add new machine name to list if it doesn't exist
        if (!availableMachineNames.includes(name.toLowerCase())) {
          setAvailableMachineNames((prev) => [...prev, name.toLowerCase()]);
        }
      } else {
        setError(new Error("Invalid QR code format"));
      }
    } catch (err) {
      setError(new Error("Error processing QR code"));
    }
  };

  const handleMachineNameChange = (e) => {
    if (e.target.value === "add-new") {
      setShowNewMachineInput(true);
      setMachineName("");
    } else {
      setMachineName(e.target.value);
    }
  };

  const handleAddNewMachineName = () => {
    if (
      newMachineName &&
      !availableMachineNames.includes(newMachineName.toLowerCase())
    ) {
      setAvailableMachineNames((prev) => [
        ...prev,
        newMachineName.toLowerCase(),
      ]);
      setMachineName(newMachineName.toLowerCase());
      setNewMachineName("");
      setShowNewMachineInput(false);
    }
  };

  const handleDeleteMachineName = (nameToDelete) => {
    setMachineToDelete(nameToDelete);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (machineToDelete) {
      setAvailableMachineNames((prev) =>
        prev.filter((name) => name !== machineToDelete)
      );
      if (machineName === machineToDelete) {
        setMachineName("");
        setMachineNo("");
      }
    }
    setShowDeleteConfirm(false);
    setMachineToDelete(null);
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

          {/* Machine Selection with QR Scanner */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Machine Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Machine Name:
                </label>
                {showNewMachineInput ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      className={inputClass}
                      value={newMachineName}
                      onChange={(e) => setNewMachineName(e.target.value)}
                      placeholder="Enter new machine name"
                    />
                    <button
                      onClick={handleAddNewMachineName}
                      className={buttonClass}
                      disabled={!newMachineName}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <select
                      className={`${inputClass} flex-grow`}
                      value={machineName}
                      onChange={handleMachineNameChange}
                    >
                      <option value="">Select Machine Name</option>
                      {availableMachineNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                      <option value="add-new">+ Add New Machine</option>
                    </select>
                    {machineName && machineName !== "add-new" && (
                      <button
                        onClick={() => handleDeleteMachineName(machineName)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                        title="Delete Machine Name"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
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
                  onChange={(e) => setMachineNo(e.target.value)}
                  placeholder="Enter machine number"
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
          </div>

          {/* Checklist */}
          <div className="space-y-4">
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
                    className={`${inputClass} mt-2`}
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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className={`${cardClass} max-w-md mx-4`}>
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete "{machineToDelete}"?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MachineDailyCheckPage;
