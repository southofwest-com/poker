import { useRef, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QRCodeDisplay({ url }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (url && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 240,
        margin: 2,
        color: {
          dark: '#3B82F6', // Blue color for QR code
          light: '#FFFFFF',
        }
      }, (error) => {
        if (error) console.error('Error generating QR code:', error);
      });
    }
  }, [url]);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 border-b border-gray-100 pb-3">Share This Session</h2>
      <div className="mb-8">
        <div className="bg-white p-4 rounded-lg inline-block shadow-md mb-2">
          <canvas ref={canvasRef} className="mx-auto" />
        </div>
        <p className="text-gray-500 mb-2">Scan this QR code to join</p>
      </div>
      <div className="mb-4">
        <p className="mb-2 text-lg font-medium">Session URL:</p>
        <div className="flex">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 p-3 border border-gray-300 rounded-l-lg bg-gray-50"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(url);
              alert('URL copied to clipboard!');
            }}
            className="bg-blue-500 text-white px-6 rounded-r-lg hover:bg-blue-600 transition-all"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}