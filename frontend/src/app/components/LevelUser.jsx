// src/app/components/LevelUser.jsx

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Menu, Activity, CheckSquare, AlertTriangle, FileText, Settings, Users, BarChart2, Sun, Moon } from "lucide-react";
import { useDarkMode } from './DarkModeProvider';
import { useAuth } from '../../contexts/AuthContext';
import { title } from "process";

function LevelUser({ userRole }) {
  const router = useRouter();
  const { darkMode, setDarkMode } = useDarkMode();
  const { user } = useAuth();

  console.log("User in LevelUser:", user);

  const handleButtonClick = (action) => {
    console.log(`${action} clicked`);
    router.push(`/main-menu/${action.replace(/\s+/g, "_")}`);
  };

  const getIcon = (action) => {
    switch (action) {
      case "DailyMachineCheck": return <CheckSquare className="h-6 w-6" />;
      case "MachineDown": return <AlertTriangle className="h-6 w-6" />;
      case "WorkInstruction": return <FileText className="h-6 w-6" />;
      case "LogDailyMachine": return <Activity className="h-6 w-6" />;
      case "LogMachineDown": return <Settings className="h-6 w-6" />;
      case "OutPutDashBoard": return <BarChart2 className="h-6 w-6" />;
      case "Register": return <Users className="h-6 w-6" />;
      case 'UserProfile': return <Settings className="h-6 w-6" />;
      default: return <ChevronRight className="h-6 w-6" />;
    }
  };

  const menuItems = {
    1: [
      { title: "Machine Daily Check", action: "daily-machine-check" },
      { title: "Machine Down", action: "machine-down" },
      { title: "Work Instruction", action: "work-instruction" },
      { title: 'User Profile', action: 'user-profile' },
    ],
    2: [
      { title: "Machine Daily Check", action: "daily-machine-check" },
      { title: "Machine Down", action: "machine-down" },
      { title: "Work Instruction", action: "work-instruction" },
      { title: "Log Daily Machine", action: "log-dailymachine" },
      { title: "Log Machine Down", action: "log-machinedown" },
      { title: "Output Dashboard", action: "output-dashboard" },
      { title: "Register User", action: "register" },
      { title: 'User Profile', action: 'user-profile' },
    ],
    3: [
      { title: "Machine Down DashBoard", action: "machinedown-dashdoard" },
      { title: 'User Profile', action: 'user-profile' },
    ],
    4: [
      { title: "Log Daily Machine", action: "log-dailymachine" },
      { title: "Log Machine Down", action: "log-machinedown" },
      { title: "Output Dashboard", action: "output-dashboard" },
      { title: "Work Instruction", action: "work-instruction" },
      { title: "Register User", action: "register" },
      { title: 'User Profile', action: 'user-profile' },
    ],
    5: [
      { title: "Log Daily Machine", action: "log-dailymachine" },
      { title: "Log Machine Down", action: "log-machinedown" },
      { title: "Output Dashboard", action: "output-dashboard" },
      { title: "Work Instruction", action: "work-instruction" },
      { title: "Register Technician", action: "register" },
      { title: "Machine Down DashBoard", action: "machinedown-dashdoard" },
      { title: 'User Profile', action: 'user-profile' },
    ],
    6: [
      { title: "Machine Daily Check", action: "daily-machine-check" },
      { title: "Machine Down", action: "machine-down" },
      { title: "Work Instruction", action: "work-instruction" },
      { title: "Log Daily Machine", action: "log-dailymachine" },
      { title: "Log Machine Down", action: "log-machinedown" },
      { title: "Machine Down DashBoard", action: "machinedown-dashdoard" },
      { title: "Output Dashboard", action: "output-dashboard" },
      { title: "Register", action: "register" },
      { title: "Delete User", action: "delete-user" },
      { title: "User Profile", action: "user-profile" },
    ],
  };

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-300">
      <div className={`max-w-4xl w-full space-y-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-3xl shadow-2xl transition-colors duration-300`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-4xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Main Menu
          </h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
          >
            {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>
        <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Welcome {user?.first_name} {user?.last_name}
        </p>
        <nav className="mt-10">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems[userRole]?.map((item, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(item.action)}
                className={`group ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} rounded-xl transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg p-6 flex flex-col items-center text-center`}
              >
                <div className={`mb-4 ${darkMode ? 'bg-gray-600' : 'bg-blue-100'} p-3 rounded-full`}>
                  {React.cloneElement(getIcon(item.action), { className: `h-6 w-6 ${darkMode ? 'text-blue-300' : 'text-blue-600'}` })}
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                <ChevronRight className={`h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default LevelUser;