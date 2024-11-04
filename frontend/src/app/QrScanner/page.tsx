// src/app/QrScanner/page.jsx

"use client";
import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import { useDarkMode } from '../components/DarkModeProvider';
import { Camera, X, QrCode } from 'lucide-react';

const QrScannerPage = () => {
  const [scanResult, setScanResult] = useState<string>('No result');
  const [error, setError] = useState<Error | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError(new Error("กล้องไม่สามารถใช้งานได้"));
      }
    }
  }, []);

  const handleScan = (data: { text: string } | null) => {
    if (data) {
      setScanResult(data.text);
      setIsCameraOpen(false);
    }
  };

  const handleError = (err: Error) => {
    setError(err);
    console.error(err);
  };

  const previewStyle = {
    height: 320,
    width: '100%',
    objectFit: 'cover' as const,
  };

  const toggleCamera = () => {
    setIsCameraOpen(!isCameraOpen);
    if (!isCameraOpen) {
      setScanResult('No result');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} p-6 flex items-center justify-center`}>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <QrCode className="mr-2 h-8 w-8" />
              QR Code Scanner
            </h1>
            <button 
              onClick={toggleCamera}
              className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                isCameraOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300`}
            >
              {isCameraOpen ? (
                <>
                  <X className="mr-2 h-5 w-5" /> ปิดกล้อง
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-5 w-5" /> เปิดกล้อง
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
              <p>Error: {error.message}</p>
            </div>
          )}

          {isClient && !error && isCameraOpen && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={previewStyle}
              />
            </div>
          )}

          <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}>
            <p className="text-lg flex items-center justify-between">
              <span>ผลการสแกน:</span>
              <span className="font-semibold truncate ml-2 max-w-[200px]">
                {scanResult}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrScannerPage;