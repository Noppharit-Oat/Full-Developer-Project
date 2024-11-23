// src/app/api/public-checklist/route.js

import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://172.31.71.125:5000";

export async function GET(req) {
    try {
        // ดึง query parameters
        const searchParams = req.nextUrl.searchParams;
        const frequency = searchParams.get("frequency") || "daily";
        const machineName = searchParams.get("machineName");
        const model = searchParams.get("model");
        // ตรวจสอบว่า params ที่จำเป็นถูกส่งมาหรือไม่
        if (!machineName || !model) {
            return NextResponse.json(
                { success: false, message: "Machine name and model are required" },
                { status: 400 }
            );
        }
        // เรียก endpoint ของ public API
        const response = await axios.get(`${BACKEND_URL}/api/public/checklist/items`, {
            params: {
                frequency,
                machineName,
                model,
            },
        });
        return NextResponse.json({
            success: true,
            data: response.data.items.map((item) => ({
                id: item.id,
                item_name: item.item_name,
                item_thai_name: item.item_thai_name,
                group_name: item.group_name,
                group_thai_name: item.group_thai_name,
                frequency: item.frequency,
            })),
        });
    } catch (error) {
        console.error("Public checklist fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.response?.data?.message || "Failed to fetch public checklist",
            },
            { status: error.response?.status || 500 }
        );
    }
}