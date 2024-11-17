// src/app/api/checklist/route.js

import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://172.31.71.125:5000";

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
    let response;

    if (authHeader) {
      // กรณีมี token - ใช้ endpoint เดิม
      response = await axios.get(`${BACKEND_URL}/api/checklist/items`, {
        params: {
          frequency,
          machineName,
          model,
        },
        headers: {
          Authorization: authHeader,
        },
      });
    } else {
      // กรณีไม่มี token - ใช้ endpoint ใหม่สำหรับ public access
      response = await axios.get(`${BACKEND_URL}/api/public/checklist/items`, {
        params: {
          frequency,
          machineName,
          model,
        },
      });
    }

   
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
