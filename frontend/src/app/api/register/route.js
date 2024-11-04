// src/app/api/register/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://10.211.55.12:5000';

export async function POST(request) {
  try {
    const body = await request.json();
    let { employee_id, password, role, first_name, last_name, email, phone_number } = body;

    // ตรวจสอบฟิลด์ที่จำเป็น
    const requiredFields = { employee_id, password, role, first_name, last_name };
    const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({ message: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    // แปลง role เป็นตัวเลข (ในกรณีที่ส่งมาเป็น string)
    role = Number(role);

    // เติม "-" สำหรับ email และ phone_number ถ้าเป็น User (role 1) และไม่ได้กรอกข้อมูล
    if (role === 1) {
      email = email || "-";
      phone_number = phone_number || "-";
    } else {
      // ตรวจสอบ email และ phone_number สำหรับ role อื่นๆ
      if (!email) {
        return NextResponse.json({ message: 'Email is required for non-user roles.' }, { status: 400 });
      }
      if (!phone_number) {
        return NextResponse.json({ message: 'Phone number is required for non-user roles.' }, { status: 400 });
      }
    }

    // Call your backend API
    const response = await axios.post(`${BACKEND_URL}/api/register`, {
      employee_id,
      password,
      role,
      first_name,
      last_name,
      email,
      phone_number
    }, {
      timeout: 5000, // 5 seconds timeout
    });

    // Forward the response from your backend
    return NextResponse.json(response.data);

  } catch (error) {
    console.error('Registration error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return NextResponse.json({ message: error.response.data.message || 'Registration failed' }, { status: error.response.status });
      } else if (error.request) {
        // The request was made but no response was received
        return NextResponse.json({ message: 'No response from server' }, { status: 503 });
      }
    }
    // Something happened in setting up the request that triggered an Error
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 });
  }
}