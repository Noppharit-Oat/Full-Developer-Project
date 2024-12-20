// src/app/api/usercheck/route.js

import { NextResponse } from "next/server";
import axios from "axios";
const BACKEND_URL = process.env.BACKEND_URL || "http://172.31.71.125:5000";
// แก้ไข POST method
export async function POST(request) {
  try {
    // 1. รับและตรวจสอบข้อมูล
    const body = await request.json();
    const { employee_id, password } = body;

    if (!employee_id || !password) {
      return NextResponse.json(
        { message: "Employee ID and password are required" },
        { status: 400 }
      );
    }

    // 2. เรียก backend API
    const response = await axios.post(
      `${BACKEND_URL}/api/public/login`,
      {
        employee_id,
        password,
      },
      {
        timeout: 5000,
      }
    );

    // 3. แปลง response
    return NextResponse.json({
      token: response.data.token,
      user: {
        employee_id: response.data.user.employee_id,
        role: response.data.user.role,
        first_name: response.data.user.first_name,
        last_name: response.data.user.last_name,
        email: response.data.user.email,
        phone_number: response.data.user.phone_number,
      },
    });
  } catch (error) {
    // 4. ปรับปรุงการจัดการ error
    console.error("Login error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        return NextResponse.json(
          { message: error.response.data.message || "Login failed" },
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
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
