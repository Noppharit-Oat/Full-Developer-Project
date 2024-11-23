// src/app/main-menu/machinedown-dashdoard/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../components/DarkModeProvider";
// import axios from 'axios'; // จะใช้จริงตอนต่อ API
import {
  AlertTriangle,
  Clock,
  Settings,
  Tool,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function MachineDownDashboardPage() {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  const [timeRange, setTimeRange] = useState("today");
  const [machineData, setMachineData] = useState({
    summary: {
      totalDowntime: 0,
      activeIssues: 0,
      resolvedToday: 0,
      avgResolutionTime: 0,
    },
    issues: [],
  });

  // Mock Data สำหรับทดสอบการแสดงผล
  const mockData = {
    today: {
      summary: {
        totalDowntime: 12.5,
        activeIssues: 3,
        resolvedToday: 5,
        avgResolutionTime: 2.4,
      },
      issues: [
        {
          id: 1,
          machineName: "CNC-001",
          status: "active",
          issue: "Motor Overheating",
          startTime: "2024-03-06 08:30:00",
          priority: "high",
          assignedTo: "John Smith",
          downtime: "2.5",
        },
        {
          id: 2,
          machineName: "MILL-003",
          status: "active",
          issue: "Calibration Error",
          startTime: "2024-03-06 10:15:00",
          priority: "medium",
          assignedTo: "Sarah Jones",
          downtime: "1.8",
        },
        {
          id: 3,
          machineName: "DRILL-002",
          status: "active",
          issue: "Power Supply Failure",
          startTime: "2024-03-06 11:45:00",
          priority: "high",
          assignedTo: "Mike Johnson",
          downtime: "1.2",
        },
      ],
    },
  };

  // จำลองการดึงข้อมูล
  useEffect(() => {
    const fetchMockData = () => {
      setTimeout(() => {
        setMachineData(mockData[timeRange]);
      }, 500);
    };

    fetchMockData();

    /* ตอนต่อ API จริง
    const fetchMachineData = async () => {
      try {
        const response = await axios.get(`http://10.211.55.12:5000/api/machinedown/${timeRange}`);
        setMachineData(response.data);
      } catch (error) {
        console.error('Error fetching machine data:', error);
      }
    };
    fetchMachineData();
    */
  }, [timeRange]);

  // Styling classes
  const cardClass = `p-6 rounded-lg shadow-md ${
    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;

  const metricCardClass = `${cardClass} flex items-center justify-between`;

  const priorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"} p-8`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header */}
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
              Machine Down Dashboard
            </h2>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Downtime */}
          <div className={metricCardClass}>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Total Downtime
              </p>
              <p className="text-2xl font-bold mt-1">
                {machineData.summary.totalDowntime} hrs
              </p>
            </div>
            <Clock
              className={`w-12 h-12 ${
                darkMode ? "text-red-400" : "text-red-500"
              }`}
            />
          </div>

          {/* Active Issues */}
          <div className={metricCardClass}>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Active Issues
              </p>
              <p className="text-2xl font-bold mt-1">
                {machineData.summary.activeIssues}
              </p>
            </div>
            <AlertTriangle
              className={`w-12 h-12 ${
                darkMode ? "text-yellow-400" : "text-yellow-500"
              }`}
            />
          </div>

          {/* Resolved Today */}
          <div className={metricCardClass}>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Resolved Today
              </p>
              <p className="text-2xl font-bold mt-1">
                {machineData.summary.resolvedToday}
              </p>
            </div>
            <CheckCircle2
              className={`w-12 h-12 ${
                darkMode ? "text-green-400" : "text-green-500"
              }`}
            />
          </div>

          {/* Average Resolution Time */}
          <div className={metricCardClass}>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Avg. Resolution Time
              </p>
              <p className="text-2xl font-bold mt-1">
                {machineData.summary.avgResolutionTime} hrs
              </p>
            </div>
            <Activity
              className={`w-12 h-12 ${
                darkMode ? "text-blue-400" : "text-blue-500"
              }`}
            />
          </div>
        </div>

        {/* Active Issues Table */}
        <div className={cardClass}>
          <h3
            className={`text-xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Active Machine Issues
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Machine
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Issue
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Priority
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Downtime
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Assigned To
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {machineData.issues.map((issue) => (
                  <tr key={issue.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        {issue.machineName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {issue.issue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityClass(
                          issue.priority
                        )}`}
                      >
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {issue.startTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {issue.downtime} hrs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {issue.assignedTo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MachineDownDashboardPage;
