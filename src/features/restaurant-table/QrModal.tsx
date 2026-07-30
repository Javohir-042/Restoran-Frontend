import { X, Download } from "lucide-react";
import type { ITable } from "./types";

export const QrModal = ({
  table,
  onClose,
}: {
  table: ITable;
  onClose: () => void;
}) => {
  const qrUrl = `${import.meta.env.VITE_BASE_URL}/restaurant-table/${table.id}/qr-image`;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xs text-center p-6">
        <div className="flex justify-end mb-1">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <h2 className="text-base font-semibold text-gray-900 mb-1">
          Stol {table.tableNumber}
        </h2>

        <p className="text-xs text-gray-400 mb-4">
          Mijoz shu QR kodni skanerlab, menyuga kiradi
        </p>

        <img
          src={qrUrl}
          alt={`Stol ${table.tableNumber} QR`}
          className="w-48 h-48 mx-auto border border-gray-100 rounded-lg"
        />

        <a
          href={qrUrl}
          download={`stol-${table.tableNumber}-qr.png`}
          className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-700"
        >
          <Download size={15} />
          Yuklab olish
        </a>
      </div>
    </div>
  );
};
