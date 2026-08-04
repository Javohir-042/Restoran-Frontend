import { useState } from "react";
import { Search, Plus, Tags, Pencil, Trash2, CheckCircle2, Ban } from "lucide-react";
import { useCategoriesAdminList, useDeleteCategory } from "@/features/category/useCategory";
import { CreateCategoryModal } from "@/features/category/CreateCategoryModal";
import { EditCategoryModal } from "@/features/category/EditCategoryModal";
import type { ICategory } from "@/features/category/types";
import { useLanguage } from "@/context/LanguageContext";

const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
);

export const CategoriesPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

    const { data: categories, isLoading, error } = useCategoriesAdminList();
    const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();
    const { t } = useLanguage();

    const filteredCategories = categories?.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameRu.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleDelete = async (id: string) => {
        if (confirm(t("Haqiqatan ham ushbu turkumni o'chirmoqchimisiz?"))) {
            try {
                await deleteCategory(id);
            } catch (error) {
                console.error("Tarmoqda xatolik", error);
                alert(t("O'chirishda xatolik yuz berdi"));
            }
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#fafafa] tracking-tight">
                        {t("Turkumlar boshqaruvi")}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a1a1aa] mt-1">
                        {t("Restoran menyusidagi barcha turkumlarni boshqaring")}
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-600/20 active:scale-95 focus:outline-none"
                >
                    <Plus size={18} />
                    {t("Yangi turkum")}
                </button>
            </div>

            {/* Stats/Summary Section */}
            {isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-gray-100 dark:border-[#27272a] shadow-sm flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-6 w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center">
                    {t("Turkumlarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")}
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-gray-100 dark:border-[#27272a] shadow-sm flex items-center justify-between group hover:border-[#1a56db]/30 hover:shadow-md transition-all">
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-[#a1a1aa] mb-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                    <Tags size={16} className="text-[#1a56db] dark:text-blue-400" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-[#fafafa] leading-none">
                                {categories?.length || 0}
                            </h3>
                            <p className="text-xs font-semibold text-gray-400 dark:text-[#71717a] mt-2">
                                {t("Jami turkumlar")}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-gray-100 dark:border-[#27272a] shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:border-emerald-500/30 hover:shadow-md transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-50 dark:from-emerald-500/5 to-transparent -z-10 rounded-bl-[100px]" />
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-[#a1a1aa] mb-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-[#fafafa] leading-none">
                                {categories?.filter(c => c.isActive).length || 0}
                            </h3>
                            <p className="text-xs font-semibold text-gray-400 dark:text-[#71717a] mt-2">{t("Faol turkumlar")}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-gray-100 dark:border-[#27272a] shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:border-red-500/30 hover:shadow-md transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-50 dark:from-red-500/5 to-transparent -z-10 rounded-bl-[100px]" />
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-[#a1a1aa] mb-2">
                                <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                                    <Ban size={16} className="text-red-500 dark:text-red-400" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-[#fafafa] leading-none">
                                {categories?.filter(c => !c.isActive).length || 0}
                            </h3>
                            <p className="text-xs font-semibold text-gray-400 dark:text-[#71717a] mt-2">{t("Nofaol")}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-100 dark:border-[#27272a] shadow-sm overflow-hidden flex flex-col">
                {/* Search */}
                <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-[#27272a]">
                    <div className="relative max-w-md">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#71717a]"
                            size={18}
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t("Turkum qidirish...")}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#27272a]/50 border border-gray-200 dark:border-[#27272a]/60 rounded-xl text-sm text-gray-700 dark:text-[#e4e4e7] placeholder:text-gray-400 dark:text-[#71717a] font-medium focus:bg-white dark:focus:bg-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]/50 transition-all"
                        />
                    </div>
                </div>

                {/* Categories List */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-[#27272a] bg-gray-50 dark:bg-[#27272a]/30">
                                <th className="py-4 px-5 text-[11px] font-bold text-gray-400 dark:text-[#71717a] uppercase tracking-wider w-1/3">
                                    {t("Nomi (Uzb)")}
                                </th>
                                <th className="py-4 px-5 text-[11px] font-bold text-gray-400 dark:text-[#71717a] uppercase tracking-wider w-1/3">
                                    {t("Nomi (Rus)")}
                                </th>
                                <th className="py-4 px-5 text-[11px] font-bold text-gray-400 dark:text-[#71717a] uppercase tracking-wider text-center w-1/6">
                                    {t("Status")}
                                </th>
                                <th className="py-4 px-5 text-[11px] font-bold text-gray-400 dark:text-[#71717a] uppercase tracking-wider text-right w-1/6">
                                    {t("Amallar")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="py-4 px-5">
                                            <Skeleton className="h-5 w-32" />
                                        </td>
                                        <td className="py-4 px-5">
                                            <Skeleton className="h-5 w-32" />
                                        </td>
                                        <td className="py-4 px-5 text-center">
                                            <Skeleton className="h-6 w-12 mx-auto rounded-full" />
                                        </td>
                                        <td className="py-4 px-5 text-right">
                                            <Skeleton className="h-8 w-16 ml-auto rounded-lg" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400 dark:text-[#71717a]">
                                            <Tags size={40} className="mb-3 opacity-20" />
                                            <p className="text-sm font-medium text-gray-500 dark:text-[#a1a1aa]">{t("Turkumlar topilmadi")}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="group hover:bg-gray-50 dark:hover:bg-[#27272a] dark:bg-[#27272a]/50 transition-colors"
                                    >
                                        <td className="py-4 px-5">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-[#fafafa]">
                                                {category.name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5">
                                            <span className="text-sm text-gray-500 dark:text-[#a1a1aa] font-medium whitespace-nowrap">
                                                {category.nameRu || t("Mavjud emas")}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-center">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${category.isActive
                                                    ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100/50 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                                    : "bg-red-50 dark:bg-red-500/10 border border-red-100/50 dark:border-red-500/20 text-red-600 dark:text-red-400"
                                                    }`}
                                            >
                                                {category.isActive ? t("Faol") : t("Nofaol")}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditingCategory(category)}
                                                    className="p-1.5 text-gray-400 dark:text-[#71717a] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors focus:outline-none"
                                                    title={t("Tahrirlash")}
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    disabled={isDeleting}
                                                    className="p-1.5 text-gray-400 dark:text-[#71717a] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                                                    title={t("O'chirish")}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateCategoryModal onClose={() => setIsCreateModalOpen(false)} />
            )}

            {editingCategory && (
                <EditCategoryModal
                    category={editingCategory}
                    onClose={() => setEditingCategory(null)}
                />
            )}
        </div>
    );
};
