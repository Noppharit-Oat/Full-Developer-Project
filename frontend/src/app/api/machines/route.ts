export const dynamic = 'force-dynamic';
// หรือ
export const runtime = 'edge';
// และต้องมีการ export functions สำหรับ HTTP methods เช่น
export async function GET() {
  // ...
}
export async function POST() {
  // ...
}