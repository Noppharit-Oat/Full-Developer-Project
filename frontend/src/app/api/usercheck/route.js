// src/app/api/usercheck/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
const BACKEND_URL = process.env.BACKEND_URL || 'http://10.211.55.12:5000';
export async function POST(request) {
try {
const body = await request.json();
const { employee_id, password } = body;
if (!employee_id || !password) {
return NextResponse.json({ message: 'Employee ID and password are required' }, { status: 400 });
 }
// Call your backend API
const response = await axios.post(`${BACKEND_URL}/api/login`, {
employee_id,
password,
 }, {
timeout: 5000, // 5 seconds timeout
 });
// Forward the response from your backend
return NextResponse.json(response.data);
 } catch (error) {
console.error('Login error:', error);
if (axios.isAxiosError(error)) {
if (error.response) {
// The request was made and the server responded with a status code
// that falls out of the range of 2xx
return NextResponse.json({ message: error.response.data.message || 'Login failed' }, { status: error.response.status });
 } else if (error.request) {
// The request was made but no response was received
return NextResponse.json({ message: 'No response from server' }, { status: 503 });
 }
 }
// Something happened in setting up the request that triggered an Error
return NextResponse.json({ message: 'An error occurred during login' }, { status: 500 });
 }
}