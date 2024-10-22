// src/app/main-menu/page.tsx


"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import LevelUser from "../../components/user/level-user";
import { useDarkMode } from '../../hooks/useDarkMode';
// import { useAuth } from '../../contexts/auth-context';

// Temporary type for user
type User = {
  role: number;
};

const MainMenuPage: React.FC = () => {
  const [userRole, setUserRole] = useState<number | null>(null);
  const { darkMode } = useDarkMode();
  // const { user, isLoading } = useAuth();
  const router = useRouter();

  // Temporary placeholders for authentication
  const user: User | null = { role: 6 }; // Simulating a logged-in user
  const isLoading = false;

  useEffect(() => {
    const checkUserData = () => {
      // Check data from useAuth hook first (commented out for now)
      if (user) {
        setUserRole(user.role);
        return;
      }

      // If no data from useAuth, check localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData) as User;
        setUserRole(parsedUser.role);
      } else {
        // If no data in localStorage, redirect to login page
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