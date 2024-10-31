// src/types/jsqr.d.ts

declare module 'jsqr' {
    interface Point {
      x: number;
      y: number;
    }
  
    interface QRCode {
      data: string;
      location: {
        topLeftCorner: Point;
        topRightCorner: Point;
        bottomRightCorner: Point;
        bottomLeftCorner: Point;
      };
    }
  
    export default function jsQR(
      data: Uint8ClampedArray,
      width: number,
      height: number
    ): QRCode | null;
  }