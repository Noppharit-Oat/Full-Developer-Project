// src/app/page.tsx

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Login from "./login/page";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /login เมื่อ Home component ถูกเรียกใช้
    router.push('/login');
  }, [router]);

  return (
    <main className="flex-grow flex items-center justify-center w-full min-h-screen bg-background text-foreground transition-colors duration-300">
      <Login />
    </main>
  );
}