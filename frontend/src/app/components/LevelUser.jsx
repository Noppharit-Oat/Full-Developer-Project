// src/app/components/LevelUser.jsx

import React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Menu,
  Activity,
  CheckSquare,
  AlertTriangle,
  FileText,
  Settings,
  Users,
  BarChart2,
  LogIn,
  PauseCircle,
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useAuth } from "../../contexts/AuthContext";
import { Trash2 } from "lucide-react";

function LevelUser({ userRole }) {
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const { user } = useAuth();

  const handleButtonClick = (path) => {
    console.log(`Navigating to: /main-menu/${path}`);
    router.push(`/main-menu/${path}`);
  };

  const getIcon = (path) => {
    switch (path) {
      case "daily-machine-check":
        return <CheckSquare className="h-6 w-6" />;
      case "machine-down":
        return <AlertTriangle className="h-6 w-6" />;
      case "work-instruction":
        return <FileText className="h-6 w-6" />;
      case "log-dailymachine":
        return <Activity className="h-6 w-6" />;
      case "log-machinedown":
        return <Settings className="h-6 w-6" />;
      case "output-dashboard":
        return <BarChart2 className="h-6 w-6" />;
      case "register":
        return <Users className="h-6 w-6" />;
      case "user-profile":
        return <Settings className="h-6 w-6" />;
      case "machinedown-dashboard":
        return <PauseCircle className="h-6 w-6" />;
      case "delete-user":
        return <Trash2 className="h-6 w-6" />;
      case "login":
        return <LogIn className="h-6 w-6" />;
      default:
        return <ChevronRight className="h-6 w-6" />;
    }
  };

  const menuItems = {
    0: [
      { title: "Machine Daily Check", path: "daily-machine-check" },
      { title: "Machine Down", path: "machine-down" },
      { title: "Work Instruction", path: "work-instruction" },
      { title: "Log Inuser", path: "login" },
    ],
    1: [
      { title: "Machine Daily Check", path: "daily-machine-check" },
      { title: "Machine Down", path: "machine-down" },
      { title: "Work Instruction", path: "work-instruction" },
      { title: "User Profile", path: "user-profile" },
    ],
    2: [
      { title: "Machine Daily Check", path: "daily-machine-check" },
      { title: "Machine Down", path: "machine-down" },
      { title: "Work Instruction", path: "work-instruction" },
      { title: "Log Daily Machine", path: "log-dailymachine" },
      { title: "Log Machine Down", path: "log-machinedown" },
      { title: "Output Dashboard", path: "output-dashboard" },
      { title: "Register User", path: "register" },
      { title: "User Profile", path: "user-profile" },
    ],
    3: [
      { title: "Machine Down Dashboard", path: "machinedown-dashboard" },
      { title: "User Profile", path: "user-profile" },
    ],
    4: [
      { title: "Log Daily Machine", path: "log-dailymachine" },
      { title: "Log Machine Down", path: "log-machinedown" },
      { title: "Output Dashboard", path: "output-dashboard" },
      { title: "Work Instruction", path: "work-instruction" },
      { title: "Register User", path: "register" },
      { title: "User Profile", path: "user-profile" },
    ],
    5: [
      { title: "Log Daily Machine", path: "log-dailymachine" },
      { title: "Log Machine Down", path: "log-machinedown" },
      { title: "Output Dashboard", path: "output-dashboard" },
      { title: "Work Instruction", path: "work-instruction" },
      { title: "Register Technician", path: "register" },
      { title: "Machine Down Dashboard", path: "machinedown-dashboard" },
      { title: "User Profile", path: "user-profile" },
    ],
    6: [
      { title: "Machine Daily Check", path: "daily-machine-check" },
      { title: "Machine Down", path: "machine-down" },
      { title: "Work Instruction", path: "work-instruction" },
      { title: "Log Daily Machine", path: "log-dailymachine" },
      { title: "Log Machine Down", path: "log-machinedown" },
      { title: "Machine Down Dashboard", path: "machinedown-dashboard" },
      { title: "Output Dashboard", path: "output-dashboard" },
      { title: "Register User", path: "register" },
      { title: "Delete User", path: "delete-user" },
      { title: "User Profile", path: "user-profile" },
    ],
  };

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-300">
      <div
        className={`max-w-4xl w-full space-y-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-8 rounded-3xl shadow-2xl transition-colors duration-300`}
      >
        <div className="space-y-6">
          <h2
            className={`text-4xl font-extrabold text-center ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            My Services
          </h2>
          <p
            className={`text-xl ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Welcome {user?.first_name} {user?.last_name}
          </p>
        </div>

        <nav className="mt-10">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems[userRole]?.map((item, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(item.path)}
                className={`group relative ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-blue-50 hover:bg-blue-100"
                } rounded-xl transition duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg p-6 flex flex-col items-center text-center`}
              >
                <div
                  className={`mb-4 ${
                    darkMode ? "bg-gray-600" : "bg-blue-100"
                  } p-3 rounded-full transition-colors duration-300`}
                >
                  {React.cloneElement(getIcon(item.path), {
                    className: `h-6 w-6 ${
                      darkMode ? "text-blue-300" : "text-blue-600"
                    }`,
                  })}
                </div>
                <h3
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.title}
                </h3>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default LevelUser;
