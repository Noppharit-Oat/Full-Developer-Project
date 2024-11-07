// src/components/QrScanner.jsx

"use client";

import React, { useState, useEffect } from "react";
import QrReader from "react-qr-scanner";
import { Camera, X, QrCode, FlipHorizontal } from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";

const QrScanner = ({ onScanSuccess, buttonText = "Scan QR Code" }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const { darkMode } = useDarkMode();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      checkCameraAvailability();
    }
  }, []);

  const checkCameraAvailability = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not available");
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      
      if (cameras.length === 0) {
        throw new Error("No cameras found");
      }
    } catch (err) {
      setError(err);
      console.error("Camera check failed:", err);
    }
  };

  const handleScan = (data) => {
    if (data) {
      onScanSuccess(data.text);
      setIsCameraOpen(false);
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner error:", err);
    setError(new Error("Camera access failed. Please check camera permissions."));
  };

  const toggleCamera = () => {
    setIsCameraOpen(!isCameraOpen);
    setError(null); // Reset error when toggling camera
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

  // Enhanced video constraints
  const videoConstraints = {
    facingMode,
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
    aspectRatio: { ideal: 1 },
    frameRate: { ideal: 30 }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-2">
        <button
          onClick={toggleCamera}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white ${
            isCameraOpen
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors duration-200`}
        >
          {isCameraOpen ? (
            <>
              <X className="w-5 h-5" />
              <span>ปิดกล้อง</span>
            </>
          ) : (
            <>
              <QrCode className="w-5 h-5" />
              <span>{buttonText}</span>
            </>
          )}
        </button>
        {isCameraOpen && (
          <button
            onClick={switchCamera}
            className="flex items-center space-x-2 px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-200"
          >
            <FlipHorizontal className="w-5 h-5" />
            <span>สลับกล้อง</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
          <p>Error: {error.message}</p>
          <p className="text-sm mt-1">Try refreshing the page or checking camera permissions.</p>
        </div>
      )}

      {isClient && !error && isCameraOpen && (
        <div className="relative w-full max-w-md aspect-square">
          {/* QR Scanner Overlay */}
          <div className="absolute inset-0 z-10">
            <div className="h-full w-full flex items-center justify-center">
              {/* Scanner Frame */}
              <div className="relative w-64 h-64">
                {/* Corner Lines */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-500"></div>

                {/* Scanning line animation */}
                <div className="absolute top-0 left-0 w-full animate-scan">
                  <div className="h-0.5 w-full bg-blue-500"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actual QR Scanner */}
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            constraints={{
              video: videoConstraints
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
            className="rounded-lg"
            chooseDeviceId={() => Promise.resolve(true)} // Allow device selection
          />
        </div>
      )}
    </div>
  );
};

export default QrScanner;