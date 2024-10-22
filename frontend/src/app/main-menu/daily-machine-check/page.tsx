// src/app/main-menu/daily-machine-check/page.tsx


"use client";

import { useState } from "react";
import { startQRScanner } from "@/lib/qr-scanner";
import Swal from "sweetalert2";

const DailyMachineCheckPage = () => {
  const [machineId, setMachineId] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);

  const handleScanMachine = async () => {
    try {
      setIsScanning(true);

      const stopScanning = await startQRScanner({
        previewElementId: "camera-preview",
        onSuccess: (result) => {
          setMachineId(result);
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

      // เพิ่มปุ่มยกเลิกการสแกน
      const cancelButton = document.createElement("button");
      cancelButton.textContent = "ยกเลิกการสแกน";
      cancelButton.className =
        "px-4 py-2 mt-4 bg-red-600 hover:bg-red-700 text-white rounded-md";
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">เช็คเครื่องจักรประจำวัน</h1>

      {/* ส่วนของการสแกน QR Code */}
      <div className="mb-6">
        <button
          onClick={handleScanMachine}
          disabled={isScanning}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-400"
        >
          {isScanning ? "กำลังสแกน..." : "สแกน QR Code เครื่องจักร"}
        </button>

        {/* Container สำหรับแสดงภาพจากกล้อง */}
        <div
          id="camera-container"
          className="mt-4 hidden"
          style={{ maxWidth: "500px" }}
        >
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              id="camera-preview"
              className="w-full"
              autoPlay
              playsInline
            ></video>
            {/* ตัวช่วยการวาง QR Code */}
            <div className="absolute inset-0 border-2 border-white/50 m-8"></div>
          </div>
        </div>
      </div>

      {/* แสดงข้อมูลเครื่องจักรที่สแกนได้ */}
      {machineId && (
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="font-semibold mb-2">ข้อมูลเครื่องจักร</h2>
          <p>รหัสเครื่องจักร: {machineId}</p>
        </div>
      )}

      {/* ฟอร์มสำหรับกรอกข้อมูลการตรวจเช็ค */}
      {machineId && (
        <form className="space-y-4">
          <div>
            <label className="block mb-2">หมายเหตุ</label>
            <textarea className="w-full p-2 border rounded-md" rows={4} />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            บันทึกการตรวจเช็ค
          </button>
        </form>
      )}
    </div>
  );
};

export default DailyMachineCheckPage;
