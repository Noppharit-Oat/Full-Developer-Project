// src/app/main-menu/output-dashboard/page.tsx

"use client";
import { useState } from "react";
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Calendar, Filter, Download } from 'lucide-react';
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

// ข้อมูลตัวอย่าง
const sampleData = [
  { date: '01/01', planned: 1000, actual: 950, efficiency: 95, downtime: 45 },
  { date: '02/01', planned: 1000, actual: 980, efficiency: 98, downtime: 30 },
  { date: '03/01', planned: 1000, actual: 1020, efficiency: 102, downtime: 15 },
  { date: '04/01', planned: 1000, actual: 890, efficiency: 89, downtime: 120 },
  { date: '05/01', planned: 1000, actual: 960, efficiency: 96, downtime: 60 },
  { date: '06/01', planned: 1000, actual: 1050, efficiency: 105, downtime: 20 },
  { date: '07/01', planned: 1000, actual: 980, efficiency: 98, downtime: 40 },
];

const CustomTooltip = ({ active, payload, label, darkMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <p className="text-sm font-semibold mb-2">วันที่: {label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: item.color }}>
            {item.name}: {item.value}
            {item.name === 'efficiency' ? '%' : ' ชิ้น'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const OutPutDashBoardPage = () => {
  const { darkMode } = useDarkMode();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const cardClass = `p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`;
  const buttonClass = `px-4 py-2 rounded-md text-white ${
    darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'
  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`;
  
  const selectClass = `px-3 py-2 rounded-md border ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:outline-none focus:ring-2 focus:ring-indigo-500`;

  const chartProps = {
    width: 500,
    height: 300,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">แดชบอร์ดผลผลิต</h1>
          <div className="flex gap-4">
            <button className={buttonClass + " flex items-center gap-2"}>
              <Filter className="w-5 h-5" />
              ตัวกรอง
            </button>
            <button className={buttonClass + " flex items-center gap-2"}>
              <Download className="w-5 h-5" />
              ดาวน์โหลดรายงาน
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={`${cardClass} mb-6 flex gap-4 items-center`}>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={selectClass}
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className={selectClass}
          >
            <option value="all">ทุกแผนก</option>
            <option value="assembly">แผนกประกอบ</option>
            <option value="welding">แผนกเชื่อม</option>
            <option value="painting">แผนกพ่นสี</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={cardClass}>
            <h3 className="text-lg font-semibold mb-2">เป้าหมายการผลิต</h3>
            <p className="text-3xl font-bold">1,000</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ชิ้น/วัน</p>
          </div>
          <div className={cardClass}>
            <h3 className="text-lg font-semibold mb-2">ผลผลิตจริง</h3>
            <p className="text-3xl font-bold">960</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ชิ้น/วัน</p>
          </div>
          <div className={cardClass}>
            <h3 className="text-lg font-semibold mb-2">ประสิทธิภาพ</h3>
            <p className="text-3xl font-bold">96%</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>เทียบกับเป้าหมาย</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Production Comparison Chart */}
          <div className={`${cardClass}`}>
            <h3 className="text-xl font-semibold mb-4">เปรียบเทียบการผลิต</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sampleData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={darkMode ? '#374151' : '#E5E7EB'} 
                />
                <XAxis 
                  dataKey="date" 
                  stroke={darkMode ? '#fff' : '#000'}
                />
                <YAxis 
                  stroke={darkMode ? '#fff' : '#000'}
                />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                <Legend />
                <Bar dataKey="planned" name="เป้าหมาย" fill="#4F46E5" />
                <Bar dataKey="actual" name="ผลผลิตจริง" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Efficiency Trend Chart */}
          <div className={`${cardClass}`}>
            <h3 className="text-xl font-semibold mb-4">แนวโน้มประสิทธิภาพ</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sampleData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={darkMode ? '#374151' : '#E5E7EB'} 
                />
                <XAxis 
                  dataKey="date" 
                  stroke={darkMode ? '#fff' : '#000'}
                />
                <YAxis 
                  stroke={darkMode ? '#fff' : '#000'}
                />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  name="ประสิทธิภาพ"
                  stroke="#EF4444"
                  fill="#EF444433"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Downtime Chart */}
          <div className={`${cardClass} lg:col-span-2`}>
            <h3 className="text-xl font-semibold mb-4">เวลาสูญเสีย (นาที)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sampleData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={darkMode ? '#374151' : '#E5E7EB'} 
                />
                <XAxis 
                  dataKey="date" 
                  stroke={darkMode ? '#fff' : '#000'}
                />
                <YAxis 
                  stroke={darkMode ? '#fff' : '#000'}
                />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="downtime"
                  name="เวลาสูญเสีย"
                  stroke="#F59E0B"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className={`${cardClass} mt-6`}>
          <h3 className="text-xl font-semibold mb-4">รายละเอียดผลผลิต</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="px-4 py-2 text-left">วันที่</th>
                  <th className="px-4 py-2 text-left">แผนก</th>
                  <th className="px-4 py-2 text-right">เป้าหมาย</th>
                  <th className="px-4 py-2 text-right">ผลผลิตจริง</th>
                  <th className="px-4 py-2 text-right">ประสิทธิภาพ</th>
                  <th className="px-4 py-2 text-right">เวลาสูญเสีย</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, index) => (
                  <tr 
                    key={index} 
                    className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <td className="px-4 py-2">{row.date}</td>
                    <td className="px-4 py-2">แผนกประกอบ</td>
                    <td className="px-4 py-2 text-right">{row.planned}</td>
                    <td className="px-4 py-2 text-right">{row.actual}</td>
                    <td className="px-4 py-2 text-right">{row.efficiency}%</td>
                    <td className="px-4 py-2 text-right">{row.downtime} นาที</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutPutDashBoardPage;