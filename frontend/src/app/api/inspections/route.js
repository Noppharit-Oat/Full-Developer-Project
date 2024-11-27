// src/app/api/inspections/route.js

import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://172.31.71.125:5000";

export async function GET(request) {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/public/inspections`, {
      timeout: 5000,
    });

    // ตรวจสอบและส่งเฉพาะข้อมูลที่ต้องการ
    if (response.data && response.data.data) {
      return NextResponse.json(response.data.data); // ส่งเฉพาะ data array
    }

    // ถ้าไม่มี data property ส่ง empty array
    return NextResponse.json([]);
  } catch (error) {
    console.error("Fetch inspections error:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return NextResponse.json(
          {
            message:
              error.response.data.message || "Failed to fetch inspections",
          },
          { status: error.response.status }
        );
      } else if (error.request) {
        return NextResponse.json(
          { message: "No response from server" },
          { status: 503 }
        );
      }
    }
    return NextResponse.json(
      { message: "Failed to fetch inspections" },
      { status: 500 }
    );
  }
}
