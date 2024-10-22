// src/components/user/level-user.tsx

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Menu, Activity, CheckSquare, AlertTriangle, FileText, Settings, Users, BarChart2, Sun, Moon } from "lucide-react";
import { useDarkMode } from '../../hooks/useDarkMode';
// import { useAuth } from '../../contexts/auth-context';

interface MenuItem {
  title: string;
  action: string;
}

interface MenuItems {
  [key: number]: MenuItem[];
}

interface LevelUserProps {
  userRole: number;
}

const LevelUser: React.FC<LevelUserProps> = ({ userRole }) => {
  const router = useRouter();
  const { darkMode, setDarkMode } = useDarkMode();
  // const { user } = useAuth();

  // Temporary user object
  const user = { first_name: 'John', last_name: 'Doe' };

  console.log("User in LevelUser:", user);

  const handleButtonClick = (action: string) => {
    console.log(`${action} clicked`);
    router.push(`/main-menu/${action.toLowerCase().replace(/\s+/g, "-")}`);
  };

  const getIcon = (action: string) => {
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

  const menuItems: MenuItems = {
    1: [
      { title: "Machine Daily Check", action: "Daily-Machine-Check" },
      { title: "Machine Down", action: "Machine-Down" },
      { title: "Work Instruction", action: "Work-Instruction" },
      { title: 'User Profile', action: 'User-Profile' },
    ],
    2: [
      { title: "Machine Daily Check", action: "Daily-Machine-Check" },
      { title: "Machine Down", action: "Machine-Down" },
      { title: "Work Instruction", action: "Work-Instruction" },
      { title: "Log Daily Machine", action: "Log-Daily-Machine" },
      { title: "Log Machine Down", action: "Log-Machine-Down" },
      { title: "Output Dashboard", action: "Out-PutDash-Board" },
      { title: "Register User", action: "Register" },
      { title: 'User Profile', action: 'User-Profile' },
    ],
    3: [
      { title: "Machine Down Board", action: "Machine-Down-Board" },
      { title: 'User Profile', action: 'User-Profile' },
    ],
    4: [
      { title: "Log Daily Machine", action: "Log-Daily-Machine" },
      { title: "Log Machine Down", action: "Log-Machine-Down" },
      { title: "Output Dashboard", action: "Out-PutDash-Board" },
      { title: "Work Instruction", action: "Work-Instruction" },
      { title: "Register User", action: "Register" },
      { title: 'User Profile', action: 'User-Profile' },
    ],
    5: [
      { title: "Log Daily Machine", action: "Log-Daily-Machine" },
      { title: "Log Machine Down", action: "Log-Machine-Down" },
      { title: "Output Dashboard", action: "Out-PutDash-Board" },
      { title: "Work Instruction", action: "Work-Instruction" },
      { title: "Register Technician", action: "Register" },
      { title: "Machine Down Board", action: "Machine-Down-Board" },
      { title: 'User Profile', action: 'User-Profile' },
    ],
    6: [
      { title: "Machine Daily Check", action: "Daily-Machine-Check" },
      { title: "Machine Down", action: "Machine-Down" },
      { title: "Work Instruction", action: "Work-Instruction" },
      { title: "Log Daily Machine", action: "Log-Daily-Machine" },
      { title: "Log Machine Down", action: "Log-Machine-Down" },
      { title: "Machine Down Board", action: "Machine-Down-Board" },
      { title: "Output Dashboard", action: "Out-Put-DashBoard" },
      { title: "Register", action: "Register" },
      { title: "Delete User", action: "DeleteUser" },
      { title: "User Profile", action: "User-Profile" },
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