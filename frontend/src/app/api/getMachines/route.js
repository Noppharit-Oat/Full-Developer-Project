import { NextResponse } from 'next/server';
import { Pool } from 'pg'; // ใช้ไลบรารีที่เหมาะสมกับฐานข้อมูลของคุณ

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // เชื่อมต่อกับฐานข้อมูล
});

export async function GET(request) {
  try {
    const res = await pool.query('SELECT * FROM Machine');
    const machines = res.rows;

    return NextResponse.json(machines);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch machines' }, { status: 500 });
  }
}
