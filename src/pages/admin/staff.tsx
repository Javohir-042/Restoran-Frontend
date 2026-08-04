import { useState } from "react";
import {
    Search,
    UserPlus,
    Pencil,
    Trash2,
    CheckCircle2,
    Users,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useStaffList, useToggleStaffActive, useDeleteStaff } from "@/features/staff/useStaff";
import { CreateStaffModal } from "@/features/staff/CreateStaffModal";
import { EditStaffModal } from "@/features/staff/EditStaffModal";
import { getImageUrl } from "@/lib/get-image-url";
import type { IStaff } from "@/features/staff/types";
import { useLanguage } from "@/context/LanguageContext";

/* ── Constants ── */
const PAGE_SIZE = 10;

const ROLE_STYLES: Record<string, string> = {
    OFITSIANT: "bg-green-50 text-green-600",
    OSHPAZ: "bg-orange-50 text-orange-600",
    KASSIR: "bg-gray-100 text-gray-600",
    ADMIN: "bg-blue-100 text-blue-700",
    SUPER_ADMIN: "bg-blue-600 text-white",
};

const ROLE_LABELS: Record<string, string> = {
    OFITSIANT: "Ofitsiant",
    OSHPAZ: "Oshpaz",
    KASSIR: "Kassir",
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
};

/* ── Helpers ── */
const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
);

const RoleBadge = ({ role }: { role: string }) => {
    const { t } = useLanguage();
    return (
        <span
            className={`text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap ${ROLE_STYLES[role] ?? "bg-gray-100 text-gray-600"}`}
        >
            {t(ROLE_LABELS[role] ?? role)}
        </span>
    );
};

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
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={onChange}
        className={`
            relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 shrink-0
            ${checked ? "bg-green-500" : "bg-gray-200"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
    >
        <span
            className={`
                inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200
                ${checked ? "translate-x-4" : "translate-x-0.5"}
            `}
        />
    </button>
);

export const StaffPage = () => {
    const { data: staffList = [], isLoading } = useStaffList();
    const toggleActive = useToggleStaffActive();
    const deleteStaff = useDeleteStaff();
    const { t } = useLanguage();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [createOpen, setCreateOpen] = useState(false);
    const [editStaff, setEditStaff] = useState<IStaff | null>(null);

    /* ── Derived ── */
    const filtered = (staffList as IStaff[]).filter((s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paginated = filtered.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );
    const activeCount = (staffList as IStaff[]).filter((s) => s.isActive).length;
    const roleCount = {
        OFITSIANT: (staffList as IStaff[]).filter((s) => s.role === "OFITSIANT").length,
        OSHPAZ: (staffList as IStaff[]).filter((s) => s.role === "OSHPAZ").length,
        KASSIR: (staffList as IStaff[]).filter((s) => s.role === "KASSIR").length,
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const confirmDelete = (staff: IStaff) => {
        if (
            window.confirm(
                `"${staff.firstName} ${staff.lastName}" ${t("ni butunlay o'chirasizmi? Bu qaytarib bo'lmaydi.")}`
            )
        ) {
            deleteStaff.mutate(staff.id);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-10">
            {/* ═══ Header ═══ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#fafafa]">
                        {t("Xodimlar boshqaruvi")}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a1a1aa] mt-0.5">
                        {t("Jami")} {activeCount} {t("ta faol xodim")}
                    </p>
                </div>
                <button
                    onClick={() => setCreateOpen(true)}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-600/20 active:scale-95"
                >
                    <UserPlus size={16} />
                    {t("Yangi xodim qo'shish")}
                </button>
            </div>

            {/* ═══ Stat Cards ═══ */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Total */}
                <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-3 sm:p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                        <Users size={18} className="text-white" />
                    </div>
                    <div className="min-w-0">
                        {isLoading ? (
                            <Skeleton className="h-6 w-8 mb-1" />
                        ) : (
                            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#fafafa]">
                                {(staffList as IStaff[]).length}
                            </p>
                        )}
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-[#a1a1aa]">{t("Jami xodimlar")}</p>
                    </div>
                </div>

                {/* Active */}
                <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-3 sm:p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={18} className="text-green-600" />
                    </div>
                    <div className="min-w-0">
                        {isLoading ? (
                            <Skeleton className="h-6 w-8 mb-1" />
                        ) : (
                            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#fafafa]">
                                {activeCount}
                            </p>
                        )}
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-[#a1a1aa]">{t("Faol xodimlar")}</p>
                    </div>
                </div>

                {/* Role breakdown */}
                <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-3 sm:p-4 col-span-2 lg:col-span-1">
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-[#a1a1aa] mb-2">{t("Rol bo'yicha")}</p>
                    {isLoading ? (
                        <Skeleton className="h-5 w-40" />
                    ) : (
                        <div className="flex flex-wrap gap-1.5">
                            <span className="text-[10px] sm:text-[11px] bg-green-50 text-green-600 px-2 py-0.5 rounded-md font-medium">
                                {t("Ofitsiant")}: {roleCount.OFITSIANT}
                            </span>
                            <span className="text-[10px] sm:text-[11px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md font-medium">
                                {t("Oshpaz")}: {roleCount.OSHPAZ}
                            </span>
                            <span className="text-[10px] sm:text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                                {t("Kassir")}: {roleCount.KASSIR}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ Search ═══ */}
            <div className="relative">
                <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#71717a]"
                    size={15}
                />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={t("Xodimlarni qidirish...")}
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] rounded-xl text-sm text-gray-700 dark:text-[#e4e4e7] placeholder:text-gray-400 dark:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all font-medium"
                />
            </div>

            {/* ═══ Table / Cards / States ═══ */}
            {isLoading ? (
                <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-5">
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : paginated.length === 0 ? (
                <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-10 text-center">
                    <p className="text-sm text-gray-400 dark:text-[#71717a]">
                        {search
                            ? `"${search}" ${t("bo'yicha xodim topilmadi")}`
                            : t("Xodimlar topilmadi")}
                    </p>
                </div>
            ) : (
                <>
                    {/* ── DESKTOP TABLE (md+) ── */}
                    <div className="hidden md:block bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-[#27272a] text-left text-xs text-gray-500 dark:text-[#a1a1aa]">
                                    <th className="px-4 py-3 font-medium">{t("Ism")}</th>
                                    <th className="px-4 py-3 font-medium">{t("Rol")}</th>
                                    <th className="px-4 py-3 font-medium">{t("Telefon")}</th>
                                    <th className="px-4 py-3 font-medium">{t("Holati")}</th>
                                    <th className="px-4 py-3 font-medium text-right">{t("Amallar")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((staff) => (
                                    <tr
                                        key={staff.id}
                                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50 dark:hover:bg-[#27272a] dark:bg-[#27272a]/50 transition-colors"
                                    >
                                        {/* Avatar & Name */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                                                    {staff.avatarUrl ? (
                                                        <img
                                                            src={getImageUrl(staff.avatarUrl)!}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs font-semibold text-gray-500 dark:text-[#a1a1aa]">
                                                            {staff.firstName.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-[#fafafa] truncate">
                                                        {staff.firstName} {staff.lastName}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 dark:text-[#71717a]">
                                                        ID: #{staff.id.slice(0, 6)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-4 py-3">
                                            <RoleBadge role={staff.role} />
                                        </td>

                                        {/* Phone */}
                                        <td className="px-4 py-3 text-gray-600 text-[13px]">
                                            {staff.phoneNumber ?? "—"}
                                        </td>

                                        {/* Toggle */}
                                        <td className="px-4 py-3">
                                            <ToggleSwitch
                                                checked={staff.isActive}
                                                onChange={() => toggleActive.mutate(staff.id)}
                                                disabled={toggleActive.isPending}
                                            />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => setEditStaff(staff)}
                                                    className="p-1.5 text-gray-400 dark:text-[#71717a] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title={t("Tahrirlash")}
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(staff)}
                                                    disabled={deleteStaff.isPending}
                                                    className="p-1.5 text-gray-400 dark:text-[#71717a] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title={t("O'chirish")}
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

                    {/* ── MOBILE CARDS (< md) ── */}
                    <div className="md:hidden space-y-3 sm:space-y-4">
                        {paginated.map((staff) => (
                            <div
                                key={staff.id}
                                className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-100 dark:border-[#27272a] p-4 shadow-sm relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-transparent -z-10 rounded-bl-[100px]" />

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex flex-1 items-center gap-3 min-w-0">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 border border-gray-200 dark:border-[#27272a] shadow-sm">
                                            {staff.avatarUrl ? (
                                                <img
                                                    src={getImageUrl(staff.avatarUrl)!}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold text-gray-500 dark:text-[#a1a1aa]">
                                                    {staff.firstName.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0 pr-2">
                                            <p className="text-[15px] font-bold text-gray-900 dark:text-[#fafafa] truncate">
                                                {staff.firstName} {staff.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-[#a1a1aa] font-medium">
                                                {staff.phoneNumber ?? "—"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-1.5 self-start">
                                        <ToggleSwitch
                                            checked={staff.isActive}
                                            onChange={() => toggleActive.mutate(staff.id)}
                                            disabled={toggleActive.isPending}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-50">
                                    <RoleBadge role={staff.role} />
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setEditStaff(staff)}
                                            className="p-2 text-gray-400 dark:text-[#71717a] hover:text-blue-600 transition-colors rounded-lg"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(staff)}
                                            disabled={deleteStaff.isPending}
                                            className="p-2 text-gray-400 dark:text-[#71717a] hover:text-red-600 transition-colors rounded-lg disabled:opacity-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Pagination ── */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a1a1aa]">
                                {filtered.length} {t("tadan")}{" "}
                                {(safePage - 1) * PAGE_SIZE + 1}–
                                {Math.min(safePage * PAGE_SIZE, filtered.length)}{" "}
                                {t("ko'rsatilmoqda")}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    disabled={safePage === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="p-1.5 rounded-lg border border-gray-200 dark:border-[#27272a] text-gray-600 hover:bg-gray-50 dark:hover:bg-[#27272a] dark:bg-[#27272a] disabled:opacity-30 transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {/* Mobile: X / Y */}
                                <span className="sm:hidden text-xs px-2 text-gray-500 dark:text-[#a1a1aa]">
                                    {safePage} / {totalPages}
                                </span>

                                {/* Desktop: numbered pages */}
                                <div className="hidden sm:flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (p) => (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === safePage
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}
                                </div>

                                <button
                                    disabled={safePage === totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="p-1.5 rounded-lg border border-gray-200 dark:border-[#27272a] text-gray-600 hover:bg-gray-50 dark:hover:bg-[#27272a] dark:bg-[#27272a] disabled:opacity-30 transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══ Modals ═══ */}
            {createOpen && (
                <CreateStaffModal onClose={() => setCreateOpen(false)} />
            )}
            {editStaff && (
                <EditStaffModal
                    staff={editStaff}
                    onClose={() => setEditStaff(null)}
                />
            )}
        </div>
    );
};
