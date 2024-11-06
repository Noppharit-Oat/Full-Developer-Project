// src/app/main-menu/daily-machine-check/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useDarkMode } from '../../components/DarkModeProvider';
// import axios from 'axios'; // จะใช้จริงตอนต่อ API
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Search,
  ClipboardCheck,
  CalendarCheck,
  User
} from 'lucide-react';

function MachineDailyCheckPage() {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  const [selectedMachine, setSelectedMachine] = useState('');
  const [checkData, setCheckData] = useState({
    checklist: [],
    history: []
  });

  // Mock Data
  const mockData = {
    machines: [
      { id: 'CNC-001', name: 'CNC Machine 1' },
      { id: 'CNC-002', name: 'CNC Machine 2' },
      { id: 'MILL-001', name: 'Milling Machine 1' }
    ],
    checklist: [
      { id: 1, item: 'Oil Level Check', status: null },
      { id: 2, item: 'Pressure Check', status: null },
      { id: 3, item: 'Temperature Check', status: null },
      { id: 4, item: 'Safety Guards Check', status: null },
      { id: 5, item: 'Emergency Stop Test', status: null },
    ],
    history: [
      {
        date: '2024-03-06',
        machineId: 'CNC-001',
        checkedBy: 'John Smith',
        status: 'completed',
        time: '08:30',
        issues: ['Low oil level']
      },
      {
        date: '2024-03-06',
        machineId: 'CNC-002',
        checkedBy: 'Sarah Jones',
        status: 'pending',
        time: '09:15',
        issues: []
      }
    ]
  };

  useEffect(() => {
    // จำลองการโหลดข้อมูล
    setCheckData({
      checklist: mockData.checklist,
      history: mockData.history
    });

    /* ตอนต่อ API จริง
    const fetchCheckData = async () => {
      try {
        const response = await axios.get('http://10.211.55.12:5000/api/daily-check');
        setCheckData(response.data);
      } catch (error) {
        console.error('Error fetching check data:', error);
      }
    };
    fetchCheckData();
    */
  }, []);

  // Styling classes
  const cardClass = `p-6 rounded-lg shadow-md ${
    darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
  }`;

  const buttonClass = `px-4 py-2 rounded-md text-white ${
    darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'
  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`;

  const inputClass = `w-full px-3 py-2 border rounded-md ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  } focus:outline-none focus:ring-2 focus:ring-indigo-500`;

  const handleStatusChange = (itemId, status) => {
    setCheckData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === itemId ? { ...item, status } : item
      )
    }));
  };

  const handleSubmit = async () => {
    // Here you would submit the check data to your API
    console.log('Submitting check data:', {
      machineId: selectedMachine,
      checklist: checkData.checklist,
      timestamp: new Date().toISOString(),
      userId: user?.id
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} p-8`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <ClipboardCheck className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
            <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Daily Machine Check
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <CalendarCheck className="w-6 h-6" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Machine Selection and Check Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Check Form */}
          <div className={cardClass}>
            <h3 className="text-xl font-bold mb-4">Inspection Checklist</h3>
            
            {/* Machine Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Machine</label>
              <select 
                className={inputClass}
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
              >
                <option value="">Select a machine...</option>
                {mockData.machines.map(machine => (
                  <option key={machine.id} value={machine.id}>
                    {machine.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Checklist */}
            <div className="space-y-4">
              {checkData.checklist.map(item => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.item}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(item.id, 'pass')}
                        className={`p-2 rounded-md ${
                          item.status === 'pass' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, 'fail')}
                        className={`p-2 rounded-md ${
                          item.status === 'fail' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {item.status === 'fail' && (
                    <textarea
                      placeholder="Enter issue details..."
                      className={`${inputClass} mt-2`}
                      rows="2"
                    />
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={handleSubmit}
              className={`${buttonClass} w-full mt-6`}
            >
              Submit Check
            </button>
          </div>

          {/* Check History */}
          <div className={cardClass}>
            <h3 className="text-xl font-bold mb-4">Today's Check History</h3>
            <div className="space-y-4">
              {checkData.history.map((record, index) => (
                <div 
                  key={index}
                  className={`border rounded-lg p-4 ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>{record.checkedBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>{record.time}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="font-medium">Machine:</span> {record.machineId}
                  </div>
                  <div className="mt-2">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                      record.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  {record.issues.length > 0 && (
                    <div className="mt-2">
                      <span className="font-medium">Issues:</span>
                      <ul className="list-disc list-inside mt-1">
                        {record.issues.map((issue, i) => (
                          <li key={i} className="text-sm">{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MachineDailyCheckPage;