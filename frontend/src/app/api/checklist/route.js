// src/app/api/checklist/route.js

import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const frequency = searchParams.get('frequency') || 'daily';
    const machineName = searchParams.get('machineName');
    const model = searchParams.get('model');

    console.log('Fetching checklist with params:', { frequency, machineName, model }); // debugging

    // Base query
    let query = `
      SELECT DISTINCT
        ci.id,
        ci.name as item_name,
        ci.thai_name as item_thai_name,
        ci.frequency,
        cg.name as group_name,
        cg.thai_name as group_thai_name
      FROM checklist_items ci
      JOIN checklist_groups cg ON ci.group_id = cg.id
    `;

    const queryParams = [];
    const conditions = [];

    // Add frequency condition
    queryParams.push(frequency);
    conditions.push(`ci.frequency = $${queryParams.length}`);

    // Add machine name and model conditions if provided
    if (machineName && model) {
      queryParams.push(machineName);
      queryParams.push(model);
      conditions.push(`EXISTS (
        SELECT 1 FROM machines m 
        WHERE m.machine_name = $${queryParams.length - 1}
        AND m.model = $${queryParams.length}
      )`);
    }

    // Combine conditions
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Add ordering
    query += ` ORDER BY cg.id, ci.id`;

    console.log('Final SQL query:', query); // debugging
    console.log('Query params:', queryParams); // debugging

    const result = await sql.query(query, queryParams);

    console.log('Query result:', result.rows); // debugging

    return NextResponse.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error details:', error); // detailed error logging
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch checklist',
        details: error.message 
      },
      { status: 500 }
    );
  }
}