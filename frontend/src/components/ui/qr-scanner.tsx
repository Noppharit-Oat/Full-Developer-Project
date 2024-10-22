// src/app/main-menu/daily-machine-check/page.tsx

'use client';

import QrScanner from '@/components/ui/qr-scanner';
import Swal from 'sweetalert2';

const DailyMachineCheckPage = () => {
  const handleScanComplete = (result: string) => {
    
    Swal.fire({
      title: 'Scan Complete!',
      text: `QR Code: ${result}`,
      icon: 'success',
      confirmButtonText: 'OK'
    });
    
    // ทำอย่างอื่นกับผลการสแกน เช่น เรียก API
    console.log('Scanned QR Code:', result);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daily Machine Check</h1>
      <div className="max-w-md mx-auto">
        <QrScanner 
          onScanComplete={handleScanComplete}
          className="mb-4"
        />
        {/* ส่วนอื่นๆ ของหน้า daily machine check */}
      </div>
    </div>
  );
};

export default DailyMachineCheckPage;