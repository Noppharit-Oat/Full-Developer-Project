// src/app/main-menu/daily-machine-check/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../components/DarkModeProvider";
import QrScanner from "@/app/components/QrScanner";
import { formatDate } from "../../components/dateFormatter";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  CalendarCheck,
  HashIcon,
  CpuIcon,
  WrenchIcon,
  BuildingIcon,
  BoxesIcon,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";

function MachineDailyCheckPage() {
  const { isLoggedIn, user, checkLoginStatus } = useAuth();
  const { darkMode } = useDarkMode();
  const router = useRouter();

  const [machineName, setMachineName] = useState("");
  const [machineNo, setMachineNo] = useState("");
  const [machineModel, setMachineModel] = useState("");
  const [machineCustomer, setMachineCustomer] = useState("");
  const [machineFamily, setMachineFamily] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checkData, setCheckData] = useState({
    checklist: [],
  });

  // Check authentication
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // Styling classes
  const cardClass = `p-6 rounded-lg shadow-md ${
    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;

  const buttonClass = `px-4 py-2 rounded-md text-white ${
    darkMode
      ? "bg-indigo-600 hover:bg-indigo-700"
      : "bg-blue-600 hover:bg-blue-700"
  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`;

  const inputClass = `w-full px-3 py-2 border rounded-md ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-gray-100 border-gray-300 text-gray-900"
  } focus:outline-none cursor-not-allowed`;

  // ดึงข้อมูล checklist จาก API
  useEffect(() => {
    const fetchChecklist = async () => {
      if (!showChecklist || !machineName || !machineModel || !isLoggedIn)
        return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const url = new URL("/api/checklist", window.location.origin);
        url.searchParams.set("frequency", "daily");
        url.searchParams.set("machineName", machineName);
        url.searchParams.set("model", machineModel);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            await Swal.fire({
              icon: "error",
              title: "Session หมดอายุ",
              text: "กรุณาเข้าสู่ระบบใหม่",
            });
            router.push("/login");
            return;
          }
          throw new Error(data.message || "Failed to fetch checklist");
        }

        if (data.data.length === 0) {
          await Swal.fire({
            icon: "warning",
            title: "ไม่พบรายการตรวจเช็ค",
            text: "ไม่พบรายการตรวจเช็คสำหรับเครื่องจักรนี้",
          });
          setShowChecklist(false);
          return;
        }

        setCheckData({
          checklist: data.items.map((item) => ({
            id: item.id,
            item: item.item_name,
            thaiItem: item.item_thai_name,
            groupName: item.group_name,
            groupThaiName: item.group_thai_name,
            status: null,
            issueDetail: "",
          })),
        });
      } catch (error) {
        console.error("Error fetching checklist:", error);
        setError(error.message);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: error.message || "ไม่สามารถโหลดรายการตรวจเช็คได้",
        });
        setShowChecklist(false);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [showChecklist, machineName, machineModel, isLoggedIn, router]);

  const handleQrCodeScanned = (scannedData) => {
    try {
      const pattern =
        /Machine Name: \[(.*?)\] ,Machine No: \[(.*?)\] ,Model: \[(.*?)\] ,Customer: \[(.*?)\] ,Family: \[(.*?)\]/i;
      const matches = scannedData.match(pattern);

      if (matches && matches.length === 6) {
        const [_, name, no, model, customer, family] = matches;
        setMachineName(name);
        setMachineNo(no);
        setMachineModel(model);
        setMachineCustomer(customer);
        setMachineFamily(family);
        setError(null);
        setShowChecklist(false);
        setCheckData({ checklist: [] });
      } else {
        setError(new Error("Invalid QR code format"));
        Swal.fire({
          icon: "error",
          title: "QR Code ไม่ถูกต้อง",
          text: "รูปแบบ QR Code ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
        });
      }
    } catch (err) {
      setError(new Error("Error processing QR code"));
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถประมวลผล QR Code ได้",
      });
    }
  };

  const handleStatusChange = (itemId, status) => {
    setCheckData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === itemId ? { ...item, status } : item
      ),
    }));
  };

  const handleIssueDetailChange = (itemId, detail) => {
    setCheckData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === itemId ? { ...item, issueDetail: detail } : item
      ),
    }));
  };

  const handleLoadChecklist = () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "error",
        title: "กรุณาเข้าสู่ระบบ",
        text: "กรุณาเข้าสู่ระบบก่อนโหลดรายการตรวจเช็ค",
      });
      router.push("/login");
      return;
    }
    setShowChecklist(true);
  };

  const handleSubmit = async () => {
    try {
      if (!isLoggedIn) {
        await Swal.fire({
          icon: "error",
          title: "กรุณาเข้าสู่ระบบ",
          text: "กรุณาเข้าสู่ระบบก่อนทำการบันทึกข้อมูล",
        });
        router.push("/login");
        return;
      }

      // Validate that all items have been checked
      const uncheckedItems = checkData.checklist.filter(
        (item) => item.status === null
      );
      if (uncheckedItems.length > 0) {
        await Swal.fire({
          icon: "warning",
          title: "กรุณาตรวจสอบให้ครบ",
          text: "กรุณาตรวจสอบรายการทั้งหมดให้ครบถ้วน",
        });
        return;
      }

      // Validate that all failed items have issue details
      const failedItemsWithoutDetails = checkData.checklist.filter(
        (item) => item.status === "fail" && !item.issueDetail.trim()
      );
      if (failedItemsWithoutDetails.length > 0) {
        await Swal.fire({
          icon: "warning",
          title: "กรุณาระบุรายละเอียด",
          text: "กรุณาระบุรายละเอียดสำหรับรายการที่ไม่ผ่านการตรวจสอบ",
        });
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch("/api/daily-check", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          machineName,
          machineNo,
          machineModel,
          machineCustomer,
          machineFamily,
          checklist: checkData.checklist.map((item) => ({
            checklist_item_id: item.id,
            status: item.status,
            issue_detail: item.issueDetail || "",
          })),
          userId: user?.id,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          await Swal.fire({
            icon: "error",
            title: "Session หมดอายุ",
            text: "กรุณาเข้าสู่ระบบใหม่",
          });
          router.push("/login");
          return;
        }
        throw new Error(data.message || "Failed to submit check");
      }

      await Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
        text: "บันทึกผลการตรวจเช็คเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 1500,
      });

      // รีเซ็ตฟอร์ม
      setMachineName("");
      setMachineNo("");
      setMachineModel("");
      setMachineCustomer("");
      setMachineFamily("");
      setShowChecklist(false);
      setCheckData({
        checklist: [],
      });
    } catch (error) {
      console.error("Error submitting check:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message || "ไม่สามารถบันทึกข้อมูลได้",
      });
    }
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"} p-8`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <ClipboardCheck
              className={`w-8 h-8 ${
                darkMode ? "text-indigo-400" : "text-indigo-500"
              }`}
            />
            <h2
              className={`text-3xl font-extrabold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Daily Machine Check
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <CalendarCheck className="w-6 h-6" />
            <span>{formatDate(new Date())}</span>
          </div>
        </div>

        {/* Machine Selection and Check Form */}
        <div className={cardClass}>
          <h3 className="text-xl font-bold mb-4">Inspection Checklist</h3>

          {/* QR Scanner */}
          <div className="flex justify-center mb-6">
            <QrScanner
              onScanSuccess={handleQrCodeScanned}
              buttonText="Scan QR Code"
            />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
              <p>Error: {error.message}</p>
            </div>
          )}

          {/* Machine Info - แสดงเมื่อสแกน QR สำเร็จ */}
          {machineName && (
            <div className="mb-8">
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <CpuIcon className="w-5 h-5" />
                  Machine Information
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please verify the machine details below before proceeding with
                  the inspection.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Machine Name Card */}
                <div
                  className={`p-4 rounded-lg border ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CpuIcon className="w-5 h-5 text-blue-500" />
                    <label className="font-medium">Machine Name</label>
                  </div>
                  <input
                    type="text"
                    className={inputClass}
                    value={machineName}
                    placeholder="Machine name will appear after scan"
                    readOnly
                  />
                </div>

                {/* Machine No Card */}
                <div
                  className={`p-4 rounded-lg border ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <HashIcon className="w-5 h-5 text-green-500" />
                    <label className="font-medium">Machine No</label>
                  </div>
                  <input
                    type="text"
                    className={inputClass}
                    value={machineNo}
                    placeholder="Machine number will appear after scan"
                    readOnly
                  />
                </div>

                {/* Model Card */}
                <div
                  className={`p-4 rounded-lg border ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <WrenchIcon className="w-5 h-5 text-purple-500" />
                    <label className="font-medium">Model</label>
                  </div>
                  <input
                    type="text"
                    className={inputClass}
                    value={machineModel}
                    placeholder="Model will appear after scan"
                    readOnly
                  />
                </div>

                {/* Customer Card */}
                <div
                  className={`p-4 rounded-lg border ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BuildingIcon className="w-5 h-5 text-orange-500" />
                    <label className="font-medium">Customer</label>
                  </div>
                  <input
                    type="text"
                    className={inputClass}
                    value={machineCustomer}
                    placeholder="Customer will appear after scan"
                    readOnly
                  />
                </div>

                {/* Family Card */}
                <div
                  className={`p-4 rounded-lg border ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BoxesIcon className="w-5 h-5 text-red-500" />
                    <label className="font-medium">Family</label>
                  </div>
                  <input
                    type="text"
                    className={inputClass}
                    value={machineFamily}
                    placeholder="Family will appear after scan"
                    readOnly
                  />
                </div>
              </div>

              {/* Load Checklist Button */}
              {!showChecklist && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium mb-1">
                        Ready to Start Inspection
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click the button to load the inspection checklist
                      </p>
                    </div>
                    <button
                      onClick={handleLoadChecklist}
                      className={`${buttonClass} px-6`}
                    >
                      โหลดรายการตรวจเช็ค
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <div className="text-lg">กำลังโหลดรายการตรวจเช็ค...</div>
            </div>
          )}

          {/* Checklist - แสดงเมื่อกดปุ่มโหลด */}
          {showChecklist && !loading && checkData.checklist.length > 0 && (
            <>
              <div className="space-y-4 mt-6">
                {/* Group checklist items by group */}
                {Object.entries(
                  checkData.checklist.reduce((groups, item) => {
                    const group = groups[item.groupName] || [];
                    group.push(item);
                    groups[item.groupName] = group;
                    return groups;
                  }, {})
                ).map(([groupName, items]) => (
                  <div key={groupName} className="border rounded-lg p-4">
                    <h4 className="text-lg font-medium mb-4">
                      {groupName}
                      <span className="block text-sm text-gray-500">
                        {items[0].groupThaiName}
                      </span>
                    </h4>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="font-medium">{item.item}</span>
                              <span className="block text-sm text-gray-500">
                                {item.thaiItem}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleStatusChange(item.id, "pass")
                                }
                                className={`p-2 rounded-md ${
                                  item.status === "pass"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                }`}
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(item.id, "fail")
                                }
                                className={`p-2 rounded-md ${
                                  item.status === "fail"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                }`}
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          {item.status === "fail" && (
                            <textarea
                              value={item.issueDetail}
                              onChange={(e) =>
                                handleIssueDetailChange(item.id, e.target.value)
                              }
                              placeholder="กรุณาระบุรายละเอียดปัญหา..."
                              className={`w-full px-3 py-2 border rounded-md ${
                                darkMode
                                  ? "bg-gray-700 border-gray-600 text-white"
                                  : "bg-white border-gray-300 text-gray-900"
                              } focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-2`}
                              rows="2"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                className={`${buttonClass} w-full mt-6`}
                disabled={!machineName || !machineNo}
              >
                บันทึกผลการตรวจเช็ค
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MachineDailyCheckPage;
