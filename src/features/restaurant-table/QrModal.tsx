import { X, Download } from "lucide-react";
import type { ITable } from "./types";
import { QRCodeSVG } from 'qrcode.react';
import { useRef } from 'react';

export const QrModal = ({
  table,
  onClose,
}: {
  table: ITable;
  onClose: () => void;
}) => {
  // Use the exact origin the frontend is running on, so any device scanning will go to this network/URL
  const qrUrl = `${window.location.origin}/table/${table.id}`;
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    // Generate an image from the SVG element
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Set canvas size matching the svg
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw white background 
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `stol-${table.tableNumber}-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    // Add margin for the generated png
    // Set src to a data URL that holds the SVG text
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xs text-center p-6 shadow-2xl">
        <div className="flex justify-end mb-1">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Stol {table.tableNumber}
        </h2>

        <p className="text-xs text-blue-600 font-medium mb-5 bg-blue-50 py-1.5 px-3 rounded-full mx-auto w-max">
          Mijoz skanerlab, menyuga kiradi
        </p>

        <div className="flex justify-center mb-6" ref={qrRef}>
          <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
            <QRCodeSVG
              value={qrUrl}
              size={200}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full py-3 inline-flex items-center justify-center gap-2 text-sm text-white bg-blue-600 rounded-xl font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 active:bg-blue-800 transition-all"
        >
          <Download size={16} />
          QR kodni yuklab olish
        </button>
      </div>
    </div>
  );
};
