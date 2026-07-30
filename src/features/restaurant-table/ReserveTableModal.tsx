import { useState } from "react";
import { X } from "lucide-react";
import { useReserveTable } from "./useTables";
import type { ITable } from "./types";

export const ReserveTableModal = ({
  table,
  onClose,
}: {
  table: ITable;
  onClose: () => void;
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const reserveTable = useReserveTable();

  const handleSubmit = () => {
    if (!date || !time || !guestName) return;
    const reservedAt = new Date(`${date}T${time}`).toISOString();
    reserveTable.mutate(
      {
        id: table.id,
        data: { reservedAt, guestName, guestPhone: guestPhone || undefined },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Stol {table.tableNumber}ni rezerv qilish
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Sana</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Vaqt</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">
              Mehmon ismi
            </label>
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Abdullaev A."
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">
              Telefon (ixtiyoriy)
            </label>
            <input
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="+998901234567"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleSubmit}
              disabled={reserveTable.isPending}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {reserveTable.isPending ? "Saqlanmoqda..." : "Rezerv qilish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
