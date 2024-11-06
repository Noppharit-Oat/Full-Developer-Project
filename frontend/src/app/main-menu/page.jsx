// src/app/main-menu/page.jsx

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import LevelUser from "../components/LevelUser";
import { useDarkMode } from '../components/DarkModeProvider';
import { useAuth } from '../../contexts/AuthContext';

const MainMenuPage = () => {
  const [userRole, setUserRole] = useState(null);
  const { darkMode } = useDarkMode();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUserData = () => {
      // ตรวจสอบข้อมูลจาก useAuth hook ก่อน
      
      if (user) {
        setUserRole(user.role);
        return;
      }

      // ถ้าไม่มีข้อมูลจาก useAuth, ตรวจสอบ localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserRole(parsedUser.role);
      } else {
        // ถ้าไม่มีข้อมูลใน localStorage, redirect ไปหน้า login
        router.push('/login');
      }
    };

    if (!isLoading) {
      checkUserData();
    }
  }, [user, isLoading, router]);

  if (isLoading || userRole === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      <LevelUser userRole={userRole} />
    </div>
  );
};

export default MainMenuPage;