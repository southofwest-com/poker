import { useRef, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QRCodeDisplay({ url }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (url && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 1,
      }, (error) => {
        if (error) console.error('Error generating QR code:', error);
      });
    }
  }, [url]);

  return (
    <div className="text-center">
      <h3 className="text-lg font-medium mb-2">Share this session</h3>
      <div className="mb-4">
        <canvas ref={canvasRef} className="mx-auto" />
      </div>
      <div className="mb-4">
        <p className="mb-1">Session URL:</p>
        <div className="flex">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 p-2 border border-gray-300 rounded-l"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(url);
              alert('URL copied to clipboard!');
            }}
            className="bg-blue-500 text-white px-4 rounded-r"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
