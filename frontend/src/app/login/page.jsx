// src/app/login/page.jsx

"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDarkMode } from "../components/DarkModeProvider";
import { useAuth } from "../../contexts/AuthContext";
import { Sun, Moon, Lock } from "lucide-react";
import Swal from "sweetalert2";

function LogInPage() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [employee_id, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/usercheck", {
        employee_id,
        password,
      });

      const { token, user } = response.data;

      login(token, user);

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        text: "ยินดีต้อนรับเข้าสู่ระบบ",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/main-menu");
      });
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";

      if (err.response) {
        errorMessage =
          err.response.data.message || "รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง";
      } else if (err.request) {
        errorMessage =
          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง";
      }

      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="space-y-10 bg-background text-foreground p-10 rounded-3xl shadow-2xl transition-colors duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-extrabold">เข้าสู่ระบบ</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {darkMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div>
              <label
                htmlFor="employee-id"
                className="block text-sm font-medium"
              >
                รหัสพนักงาน
              </label>
              <input
                id="employee-id"
                name="employee-id"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="รหัสพนักงาน"
                value={employee_id}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              </span>
              {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogInPage;
