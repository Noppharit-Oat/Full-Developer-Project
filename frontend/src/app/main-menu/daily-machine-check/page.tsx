// src/app/main-menu/daily-machine-check/page.tsx
"use client";
import { useState } from "react";
import { startQRScanner } from "@/lib/qr-scanner";
import { useDarkMode } from '@/contexts/DarkModeContext';
import { QrCode } from 'lucide-react';
import Swal from "sweetalert2";

interface CheckData {
  machineId: string;
  note: string;
}

const DailyMachineCheckPage = () => {
  const { darkMode } = useDarkMode();
  const [machineId, setMachineId] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [formData, setFormData] = useState<CheckData>({
    machineId: "",
    note: "",
  });

  const handleScanMachine = async () => {
    try {
      setIsScanning(true);
      const stopScanning = await startQRScanner({
        previewElementId: "camera-preview",
        onSuccess: (result) => {
          setMachineId(result);
          setFormData(prev => ({ ...prev, machineId: result }));
          setIsScanning(false);
          Swal.fire({
            title: "สแกนสำเร็จ!",
            text: `รหัสเครื่องจักร: ${result}`,
            icon: "success",
          });
        },
        onError: (error) => {
          setIsScanning(false);
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: error,
            icon: "error",
          });
        },
      });

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "ยกเลิกการสแกน";
      cancelButton.className = buttonClass;
      cancelButton.onclick = () => {
        stopScanning();
        setIsScanning(false);
        const previewContainer = document.getElementById("camera-container");
        if (previewContainer) {
          previewContainer.style.display = "none";
        }
      };

      const previewContainer = document.getElementById("camera-container");
      if (previewContainer) {
        previewContainer.style.display = "block";
        previewContainer.appendChild(cancelButton);
      }
    } catch (error) {
      console.error("ไม่สามารถเริ่มการสแกนได้:", error);
      setIsScanning(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineId) {
      Swal.fire({
        title: "กรุณาสแกน QR Code",
        text: "กรุณาสแกน QR Code เครื่องจักรก่อนบันทึก",
        icon: "warning",
      });
      return;
    }
    console.log('Form submitted:', formData);
    Swal.fire({
      title: "บันทึกสำเร็จ!",
      text: "บันทึกข้อมูลการตรวจเช็คเรียบร้อยแล้ว",
      icon: "success",
    });
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
            เช็คเครื่องจักรประจำวัน
          </h2>
          <button
            onClick={handleScanMachine}
            disabled={isScanning}
            className={`${buttonClass} flex items-center`}
          >
            <QrCode className="w-5 h-5 mr-2" />
            {isScanning ? "กำลังสแกน..." : "สแกน QR"}
          </button>
        </div>

        {/* Camera Preview */}
        <div
          id="camera-container"
          className="mt-4 hidden"
        >
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              id="camera-preview"
              className="w-full"
              autoPlay
              playsInline
            ></video>
            <div className="absolute inset-0 border-2 border-white/50 m-8"></div>
          </div>
        </div>

        {/* Machine ID Display */}
        <div className="mb-6">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            รหัสเครื่องจักร
          </label>
          <div className={`mt-1 p-2 border rounded-md ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50 text-gray-900'}`}>
            {machineId || 'กรุณาสแกน QR Code เครื่องจักร'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Note */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              หมายเหตุ
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className={inputClass}
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          >
            บันทึกการตรวจเช็ค
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyMachineCheckPage;