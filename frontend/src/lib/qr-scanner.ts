// src/lib/qr-scanner.ts

import jsQR from 'jsqr';

interface QRScannerOptions {
  onSuccess?: (result: string) => void;
  onError?: (error: string) => void;
  previewElementId?: string; // ID ของ element ที่จะแสดงภาพจากกล้อง
}

let stream: MediaStream | null = null;

export const startQRScanner = async ({ 
  onSuccess, 
  onError,
  previewElementId 
}: QRScannerOptions = {}): Promise<() => void> => {
  try {
    // ขอสิทธิ์การใช้งานกล้อง
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    // หา video element สำหรับแสดงภาพ
    const videoElement = previewElementId 
      ? document.getElementById(previewElementId) as HTMLVideoElement
      : document.createElement('video');

    if (!videoElement) {
      throw new Error('ไม่พบ element สำหรับแสดงภาพจากกล้อง');
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // ตั้งค่า video
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    videoElement.playsInline = true;

    // เริ่มการสแกน
    let isScanning = true;
    const scan = () => {
      if (!isScanning) return;

      if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA && context) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          onSuccess?.(code.data);
          stopScanning();
        }
      }

      if (isScanning) {
        requestAnimationFrame(scan);
      }
    };

    videoElement.onloadedmetadata = () => {
      scan();
    };

    // ฟังก์ชันสำหรับหยุดการสแกน
    const stopScanning = () => {
      isScanning = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
      videoElement.srcObject = null;
    };

    return stopScanning;

  } catch (error) {
    onError?.(error instanceof Error ? error.message : 'ไม่สามารถเข้าถึงกล้องได้');
    throw error;
  }
};