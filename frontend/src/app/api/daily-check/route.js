// src/app/api/daily-check/route.js

import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://172.31.71.125:5000";

export async function POST(req) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization");

    // กรณี Machine Idle
    if (body.maintenance_type === "mc_idle") {
      const idleData = {
        machine_name: body.machine_name,
        machine_no: body.machine_no,
        model: body.model,
        customer: body.customer,
        family: body.family,
        maintenance_type: "mc_idle",
        employee_id: body.employee_id,
        checked_at: body.checked_at,
      };

      // เลือก endpoint ตาม auth
      const endpoint = authHeader
        ? `${BACKEND_URL}/api/checklist/inspection/idle`
        : `${BACKEND_URL}/api/public/checklist/inspection/idle`;

      const response = await axios.post(endpoint, idleData, {
        headers: authHeader ? { Authorization: authHeader } : {},
      });

      return NextResponse.json({
        success: true,
        message: "Machine idle status recorded successfully",
      });
    }

    // กรณีตรวจเช็คปกติ
    const inspectionData = {
      machine_name: body.machine_name,
      machine_no: body.machine_no,
      model: body.model,
      customer: body.customer,
      family: body.family,
      maintenance_type: "daily_check",
      employee_id: body.employee_id,
      checked_at: body.checked_at,
      inspections: body.checklist_item_id.map((id, index) => ({
        checklist_item_id: id,
        status: body.status[index],
        issue_detail: body.issue_detail[index] || "",
      })),
    };

    // เลือก endpoint ตาม auth
    const endpoint = authHeader
      ? `${BACKEND_URL}/api/checklist/inspection`
      : `${BACKEND_URL}/api/public/checklist/inspection`;

    const response = await axios.post(endpoint, inspectionData, {
      headers: authHeader ? { Authorization: authHeader } : {},
    });

    return NextResponse.json({
      success: true,
      message: "Inspection recorded successfully",
    });
  } catch (error) {
    console.error("Error submitting inspection:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Failed to submit inspection",
      },
      { status: error.response?.status || 500 }
    );
  }
}
