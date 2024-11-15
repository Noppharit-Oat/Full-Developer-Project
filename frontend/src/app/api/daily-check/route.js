// src/app/api/daily-check/route.js
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "https://172.31.71.125";

export async function POST(req) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization token is required" },
        { status: 401 }
      );
    }

    // แปลงข้อมูลให้ตรงกับ format ที่ backend ต้องการ
    const inspectionData = body.checklist.map(item => ({
      checklist_item_id: item.id,
      machine_name: body.machineName,
      machine_no: body.machineNo,
      model: body.machineModel,
      customer: body.machineCustomer,
      family: body.machineFamily,
      status: item.status,
      issue_detail: item.issueDetail || '',
      user_id: body.userId
    }));

    // เรียก API create inspection
    const response = await axios.post(
      `${BACKEND_URL}/api/checklist/inspection`,
      { inspections: inspectionData },
      {
        headers: {
          Authorization: authHeader
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: "Inspection recorded successfully"
    });

  } catch (error) {
    console.error("Error submitting inspection:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Failed to submit inspection"
      },
      { status: error.response?.status || 500 }
    );
  }
}