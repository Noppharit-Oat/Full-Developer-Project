// src/contexts/AuthContext.jsx
"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // เพิ่ม state สำหรับเก็บ token

  // ปรับปรุง checkLoginStatus
  const checkLoginStatus = useCallback(() => {
    const storedToken = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user") || "null");

    if (storedToken && userData) {
      setIsLoggedIn(true);
      setUser(userData);
      setToken(storedToken);
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  // ปรับปรุง login function
  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
    setToken(newToken);
  };

  // ปรับปรุง logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
  };

  // สร้าง function สำหรับดึง token
  const getAuthHeader = useCallback(() => {
    const currentToken = token || localStorage.getItem("token");
    return currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        token,
        login,
        logout,
        checkLoginStatus,
        getAuthHeader, // เพิ่ม getAuthHeader เข้าไปใน context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
