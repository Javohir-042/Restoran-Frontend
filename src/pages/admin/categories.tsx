import { useState } from "react";
import { Search, Plus, Tags, Pencil, Trash2, CheckCircle2, Ban } from "lucide-react";
import { useCategoriesAdminList, useDeleteCategory } from "@/features/category/useCategory";
import { CreateCategoryModal } from "@/features/category/CreateCategoryModal";
import { EditCategoryModal } from "@/features/category/EditCategoryModal";
import type { ICategory } from "@/features/category/types";

const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
);

export const CategoriesPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

    const { data: categories, isLoading, error } = useCategoriesAdminList();
    const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();

    const filteredCategories = categories?.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameRu.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleDelete = async (id: string) => {
        if (confirm("Haqiqatan ham ushbu turkumni o'chirmoqchimisiz?")) {
            try {
                await deleteCategory(id);
            } catch (error) {
                console.error("Tarmoqda xatolik", error);
                alert("O'chirishda xatolik yuz berdi");
            }
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                        Turkumlar boshqaruvi
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Restoran menyusidagi barcha turkumlarni boshqaring
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                    <Plus size={18} />
                    Yangi turkum
                </button>
            </div>

            {/* Stats/Summary Section */}
            {isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
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
                    Turkumlarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#1a56db]/30 hover:shadow-md transition-all">
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <Tags size={16} className="text-[#1a56db]" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 leading-none">
                                {categories?.length || 0}
                            </h3>
                            <p className="text-xs font-semibold text-gray-400 mt-2">
                                Jami turkumlar
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-emerald-500/30 hover:shadow-md transition-all">
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 leading-none">
                                {categories?.filter(c => c.isActive).length || 0}
                            </h3>
                            <p className="text-xs font-semibold text-gray-400 mt-2">Faol turkumlar</p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-red-500/30 hover:shadow-md transition-all">
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                    <Ban size={16} className="text-red-500" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 leading-none">
                                {categories?.filter(c => !c.isActive).length || 0}
                            </h3>
                            <p className="text-xs font-semibold text-gray-400 mt-2">Nofaol</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                {/* Search */}
                <div className="p-4 sm:p-5 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Turkum qidirish..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-sm text-gray-700 placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all"
                        />
                    </div>
                </div>

                {/* Categories List */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-1/3">
                                    Nomi (Uzb)
                                </th>
                                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-1/3">
                                    Nomi (Rus)
                                </th>
                                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-1/6">
                                    Status
                                </th>
                                <th className="py-4 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right w-1/6">
                                    Amallar
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
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Tags size={40} className="mb-3 opacity-20" />
                                            <p className="text-sm font-medium text-gray-500">Turkumlar topilmadi</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="group hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="py-4 px-5">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {category.name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5">
                                            <span className="text-sm text-gray-600">
                                                {category.nameRu || "Mavjud emas"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-center">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${category.isActive
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-red-50 text-red-600"
                                                    }`}
                                            >
                                                {category.isActive ? "Faol" : "Nofaol"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditingCategory(category)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none"
                                                    title="Tahrirlash"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    disabled={isDeleting}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                                                    title="O'chirish"
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
