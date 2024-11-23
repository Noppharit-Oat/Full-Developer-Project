// src/components/QrScanner.jsx

"use client";

/* eslint-disable no-console */
/* eslint-disable react/no-unknown-property */

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { X, QrCode, FlipHorizontal } from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";

// Override console to filter out specific warnings
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
console.warn = function filterWarnings(msg, ...args) {
  if (
    msg.includes("defaultProps") ||
    msg.includes("facingMode") ||
    msg.includes("legacyMode") ||
    msg.includes("Canvas2D")
  ) {
    return;
  }
  return originalConsoleWarn.apply(console, [msg, ...args]);
};

console.error = function filterErrors(msg, ...args) {
  if (
    msg.includes("defaultProps") ||
    msg.includes("facingMode") ||
    msg.includes("legacyMode")
  ) {
    return;
  }
  return originalConsoleError.apply(console, [msg, ...args]);
};

// Dynamic import for QR Scanner
const QrReader = dynamic(() => import("react-qr-scanner"), {
  ssr: false,
});

const QrScanner = ({ onScanSuccess, buttonText }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const { darkMode } = useDarkMode();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      checkCameraAvailability();

      // Set willReadFrequently attribute on canvas
      const canvas = document.createElement("canvas");
      canvas.setAttribute("willreadfrequently", "true");
    }
  }, []);

  const checkCameraAvailability = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not available");
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");

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
    setError(
      new Error("Camera access failed. Please check camera permissions.")
    );
  };

  const toggleCamera = () => {
    setIsCameraOpen(!isCameraOpen);
    setError(null);
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Video constraints configuration
  const constraints = {
    video: {
      facingMode,
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 },
      aspectRatio: { ideal: 1 },
      frameRate: { ideal: 30 },
    },
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
              <span>{buttonText || "Scan QR Code"}</span>
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
          <p className="text-sm mt-1">
            Try refreshing the page or checking camera permissions.
          </p>
        </div>
      )}

      {isClient && !error && isCameraOpen && (
        <div className="relative w-full max-w-md aspect-square bg-black rounded-lg overflow-hidden">
          {/* QR Scanner Overlay */}
          <div className="absolute inset-0 z-10">
            <div className="h-full w-full flex items-center justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-500"></div>
                <div className="absolute top-0 left-0 w-full animate-scan">
                  <div className="h-0.5 w-full bg-blue-500"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-full">
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              constraints={constraints}
              className="w-full h-full object-cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QrScanner;
