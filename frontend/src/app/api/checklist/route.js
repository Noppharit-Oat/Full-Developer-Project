// src/app/api/checklist/route.js
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "https://172.31.71.125";

export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const frequency = searchParams.get("frequency") || "daily";
    const machineName = searchParams.get("machineName");
    const model = searchParams.get("model");

    // validate params
    if (!machineName || !model) {
      return NextResponse.json(
        { success: false, message: "Machine name and model are required" },
        { status: 400 }
      );
    }

    // get auth header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization token is required" },
        { status: 401 }
      );
    }

    // เรียก API ตาม endpoint ที่มีอยู่
    const response = await axios.get(`${BACKEND_URL}/api/checklist/items`, {
      params: {
        frequency,
        machineName,
        model,
      },
      headers: {
        Authorization: authHeader,
      },
    });

    // map data ให้ตรงกับที่ frontend ต้องการ
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
    console.error("Checklist fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Failed to fetch checklist",
      },
      { status: error.response?.status || 500 }
    );
  }
}
