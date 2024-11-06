// src/app/main-menu/Register/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, UserPlus } from "lucide-react";
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDarkMode } from '../../components/DarkModeProvider';

function RegisterPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    email: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    switch (user.role) {
      case 4:
        setAvailableRoles([1, 2]);
        setSelectedRole(1);
        break;
      case 5:
        setAvailableRoles([3]);
        setSelectedRole(3);
        break;
      case 6:
        setAvailableRoles([1, 2, 3, 4, 5, 6]);
        setSelectedRole(1);
        break;
      default:
        router.push('/main-menu');
    }
  }, [user, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/register', {
        ...formData,
        role: selectedRole
      });
      console.log('User registered:', response.data);
      
      // Show success alert
      await Swal.fire({
        position: "center",
        icon: "success",
        title: "ลงทะเบียนสำเร็จ",
        text: "บัญชีผู้ใช้ถูกสร้างเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 1500
      });

      // Redirect to main-menu after successful registration
      router.push('/main-menu');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน',
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRoleChange = (event) => {
    setSelectedRole(Number(event.target.value));
  };

  if (!user || availableRoles.length === 0) {
    return <div>Loading...</div>;
  }

  const fields = [
    { id: "employee-no", name: "employee_id", type: "text", placeholder: "รหัสพนักงาน", required: true },
    { id: "email", name: "email", type: "email", placeholder: "อีเมล", required: selectedRole !== 1 },
    { id: "phone", name: "phone_number", type: "text", placeholder: "เบอร์โทรภายใน", required: selectedRole !== 1 },
    { id: "firstname", name: "first_name", type: "text", placeholder: "ชื่อ", required: true },
    { id: "lastname", name: "last_name", type: "text", placeholder: "นามสกุล", required: true },
    { id: "password", name: "password", type: "password", placeholder: "รหัสผ่าน", required: true },
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? "bg-gray-900" : "bg-gray-100"
    } transition-colors duration-300 px-4 sm:px-6 lg:px-8`}>
      <div className={`max-w-md w-full space-y-5 ${
        darkMode ? "bg-gray-800" : "bg-white"
      } p-10 rounded-3xl shadow-2xl transition-colors duration-300`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-3xl font-extrabold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            สมัครสมาชิก
          </h2>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <form className="mt-10 space-y-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div className="space-y-1">
              <label htmlFor="role" className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                ระดับผู้ใช้งาน
              </label>
              <select
                id="role"
                name="role"
                required
                value={selectedRole}
                onChange={handleRoleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role === 1 && "User"}
                    {role === 2 && "Supervisor"}
                    {role === 3 && "Technician"}
                    {role === 4 && "Super User"}
                    {role === 5 && "Super Technician"}
                    {role === 6 && "Admin"}
                  </option>
                ))}
              </select>
            </div>
            {fields.map((field) => (
              <div key={field.id} className="space-y-1">
                <label htmlFor={field.id} className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  {field.placeholder}
                </label>
                <input
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 text-gray-900"
                  } placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                darkMode
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className={`h-5 w-5 ${
                  darkMode
                    ? "text-indigo-500 group-hover:text-indigo-400"
                    : "text-blue-500 group-hover:text-blue-400"
                }`} />
              </span>
              สมัครสมาชิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;