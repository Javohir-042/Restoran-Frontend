import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  UtensilsCrossed,
  CheckCircle2,
  Ban,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  useMenuItemsAdminList,
  useToggleMenuItemAvailability,
  useDeleteMenuItem,
} from "@/features/menu-item/useMenuItem";
import { useCategoriesAdminList } from "@/features/category/useCategory";
import { CreateMenuItemModal } from "@/features/menu-item/CreateMenuItemModal";
import { EditMenuItemModal } from "@/features/menu-item/EditMenuItemModal";
import { getImageUrl } from "@/lib/get-image-url";
import type { IMenuItem } from "@/features/menu-item/types";

const PAGE_SIZE = 5;

const formatSom = (n: number) =>
  new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
);

const ToggleSwitch = ({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-green-500" : "bg-gray-200"} ${disabled ? "opacity-50" : ""}`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
    />
  </button>
);

export const MenuPage = () => {
  const { data: menuItems = [], isLoading } = useMenuItemsAdminList();
  const { data: categories = [] } = useCategoriesAdminList();
  const toggleAvailability = useToggleMenuItemAvailability();
  const deleteMenuItem = useDeleteMenuItem();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<IMenuItem | null>(null);

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesTab = activeTab === "all" || item.categoryId === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [menuItems, search, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const activeCount = menuItems.filter((i) => i.isAvailable).length;
  const stoppedCount = menuItems.filter((i) => !i.isAvailable).length;

  const confirmDelete = (item: IMenuItem) => {
    if (window.confirm(`"${item.name}" taomini o'chirasizmi?`)) {
      deleteMenuItem.mutate(item.id);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Menyu boshqaruvi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Restoran menyusidagi barcha taomlar va ichimliklarni boshqaring
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Yangi taom qo'shish
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <UtensilsCrossed size={18} className="text-blue-600" />
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-8 mb-1" />
            ) : (
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {menuItems.length}
              </p>
            )}
            <p className="text-[11px] sm:text-xs text-gray-500">Jami taomlar</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-green-600" />
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-8 mb-1" />
            ) : (
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {activeCount}
              </p>
            )}
            <p className="text-[11px] sm:text-xs text-gray-500">Aktiv</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <Ban size={18} className="text-red-500" />
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-8 mb-1" />
            ) : (
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {stoppedCount}
              </p>
            )}
            <p className="text-[11px] sm:text-xs text-gray-500">To'xtatilgan</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          size={15}
        />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Taom qidirish..."
          className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-4 border-b border-gray-100 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab("all");
            setPage(1);
          }}
          className={`pb-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === "all" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}
        >
          Barchasi
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setActiveTab(c.id);
              setPage(1);
            }}
            className={`pb-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === c.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-sm text-gray-400">Taom topilmadi</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                <th className="px-4 py-3 font-medium">Taom rasmi</th>
                <th className="px-4 py-3 font-medium">Nomi</th>
                <th className="px-4 py-3 font-medium">Kategoriya</th>
                <th className="px-4 py-3 font-medium">Narxi</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                >
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                      {item.avatarUrl ? (
                        <img
                          src={getImageUrl(item.avatarUrl)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">
                          🍽️
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {item.category?.name ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatSom(item.price)}
                  </td>
                  <td className="px-4 py-3">
                    <ToggleSwitch
                      checked={item.isAvailable}
                      onChange={() => toggleAvailability.mutate(item.id)}
                      disabled={toggleAvailability.isPending}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditItem(item)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => confirmDelete(item)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-xs text-gray-500">
            {filtered.length} tadan {(safePage - 1) * PAGE_SIZE + 1}-
            {Math.min(safePage * PAGE_SIZE, filtered.length)} ko'rsatilmoqda
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={safePage === 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-7 h-7 rounded-lg border border-gray-200 disabled:opacity-30"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-xs ${p === safePage ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-7 h-7 rounded-lg border border-gray-200 disabled:opacity-30"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {createOpen && (
        <CreateMenuItemModal onClose={() => setCreateOpen(false)} />
      )}
      {editItem && (
        <EditMenuItemModal item={editItem} onClose={() => setEditItem(null)} />
      )}
    </div>
  );
};
