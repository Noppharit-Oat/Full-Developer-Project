// src/components/layout/navbar.tsx

"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Sun, Moon, LogOut } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";
//import { useAuth } from "../../contexts/auth-context";
import Swal from "sweetalert2";

const Navbar: React.FC = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const router = useRouter();
  const pathname = usePathname();
  //const { isLoggedIn, user, logout, checkLoginStatus } = useAuth();
  
    // Temporary placeholders for authentication
    const isLoggedIn = true; // หรือ false ตามที่ต้องการ
    const user = { role: 1 }; // สมมติว่ามี role เป็น 1
    const logout = () => console.log("Logout function called");
    const checkLoginStatus = () => console.log("Check login status called");
  // Temporary placeholders for authentication
  
  useEffect(() => {
    checkLoginStatus();
  }, [pathname, checkLoginStatus]);

  const handleLogout = () => {
    Swal.fire({
      title: "ออกจากระบบ",
      text: "คุณต้องการออกจากระบบใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        router.push("/login");
        Swal.fire(
          "ออกจากระบบแล้ว!",
          "คุณได้ออกจากระบบเรียบร้อยแล้ว",
          "success"
        );
      }
    });
  };

  const handleMachineDownClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isLoggedIn || (user?.role && ![3, 5, 6].includes(user.role))) {
      const { value: password } = await Swal.fire({
        title: "กรุณาใส่รหัสผ่าน",
        input: "password",
        inputLabel: "รหัสผ่าน",
        inputPlaceholder: "ใส่รหัสผ่านของคุณ",
        inputAttributes: {
          maxlength: "10",
          autocapitalize: "off",
          autocorrect: "off",
        },
      });
      if (password === "424" || password === "123") {
        router.push("/main-menu/MachineDownBoard");
      } else {
        Swal.fire({
          icon: "error",
          title: "รหัสผ่านไม่ถูกต้อง",
          text: "กรุณาลองใหม่อีกครั้ง",
        });
      }
    } else {
      router.push("/main-menu/machine-dashboard");
    }
  };

  return (
    <nav
      className={`w-full p-4 ${
        darkMode ? "bg-gray-800" : "bg-white"
      } transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <Link href="/main-menu">Main Menu</Link>
        </div>
        <ul className="flex space-x-6 items-center">
          <li>
            <Link
              href="/main-menu/output-dashboard"
              className={`${
                darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Output Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className={`${
                darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={handleMachineDownClick}
            >
              Machine Dashboard
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className={`flex items-center ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <LogOut className="h-5 w-5 mr-1" />
                Log Out
              </button>
            </li>
          )}
          <li>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-yellow-300"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;