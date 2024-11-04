// src/app/MainMenu/UserProfile/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from '../../../contexts/AuthContext';
import { useDarkMode } from '../../components/DarkModeProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import { User, Mail, Phone, Lock, CreditCard, Save } from 'lucide-react';

function UserProfilePage() {
  const { user, setUser } = useAuth();
  const { darkMode } = useDarkMode();
  const [userData, setUserData] = useState({
    employee_id: '',
    email: '',
    phone_number: '',
    first_name: '',
    last_name: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        employee_id: user.employee_id || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
    }
  }, [user]);

  const updateProfile = async (data) => {
    try {
      const response = await axios.put('http://10.211.55.12:5000/api/updateProfile', {
        ...userData,
        ...data
      });
      setUser(response.data.user);
      setUserData(prevData => ({ ...prevData, ...response.data.user }));
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: response.data.message,
        confirmButtonColor: darkMode ? '#4C51BF' : '#3B82F6',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'An error occurred while updating your profile.',
        confirmButtonColor: darkMode ? '#4C51BF' : '#3B82F6',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSumUpdate = () => {
    updateProfile(userData);
  };

  const updatePassword = async () => {
    const { value: password } = await Swal.fire({
      title: "Change Password",
      input: "password",
      inputLabel: "New Password",
      inputPlaceholder: "Enter your new password",
      inputAttributes: {
        maxlength: "20",
        autocapitalize: "off",
        autocorrect: "off"
      }
    });
    if (password) {
      updateProfile({ password });
    }
  };

  const buttonClass = `px-4 py-2 rounded-md text-white ${
    darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'
  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`;

  const inputClass = `w-full px-3 py-2 border ${
    darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`;

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-lg w-full space-y-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-10 rounded-xl shadow-lg`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            User Profile
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`${buttonClass} flex items-center`}
          >
            {isEditing ? (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Lock
              </>
            ) : (
              <>
                <User className="w-5 h-5 mr-2" />
                Edit
              </>
            )}
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Employee ID
            </label>
            <div className="mt-1 flex items-center">
              <CreditCard className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
              <span className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userData.employee_id}</span>
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={userData.first_name}
                onChange={handleInputChange}
                className={inputClass}
              />
            ) : (
              <div className={`mt-1 text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userData.first_name}</div>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="last_name"
                value={userData.last_name}
                onChange={handleInputChange}
                className={inputClass}
              />
            ) : (
              <div className={`mt-1 text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userData.last_name}</div>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className={inputClass}
              />
            ) : (
              <div className={`mt-1 text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userData.email}</div>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone_number"
                value={userData.phone_number}
                onChange={handleInputChange}
                className={inputClass}
              />
            ) : (
              <div className={`mt-1 text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userData.phone_number}</div>
            )}
          </div>
          <div className="flex justify-between">
            <button onClick={updatePassword} className={`${buttonClass} flex items-center`}>
              <Lock className="w-5 h-5 mr-2" />
              Change Password
            </button>
            {isEditing && (
              <button onClick={handleSumUpdate} className={`${buttonClass} flex items-center`}>
                <Save className="w-5 h-5 mr-2" />
                Save All Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;