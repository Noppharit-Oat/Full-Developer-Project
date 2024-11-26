// src/app/api/inspections/route.js

import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://172.31.71.125:5000";

export async function GET(request) {
    try {
        // เรียก API จาก backend
        const response = await axios.get(`${BACKEND_URL}/public/inspections`, {
            timeout: 5000 // 5 seconds timeout
        });

        // ส่งข้อมูลกลับไปที่ frontend
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Fetch inspections error:", error);
        
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Server responded with error
                return NextResponse.json(
                    { 
                        message: error.response.data.message || "Failed to fetch inspections" 
                    },
                    { status: error.response.status }
                );
            } else if (error.request) {
                // No response received
                return NextResponse.json(
                    { message: "No response from server" },
                    { status: 503 }
                );
            }
        }

        // General error
        return NextResponse.json(
            { message: "Failed to fetch inspections" },
            { status: 500 }
        );
    }
}