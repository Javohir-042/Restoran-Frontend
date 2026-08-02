import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useUpdateCategory } from "./useCategory";
import type { ICategory } from "./types";

interface EditCategoryModalProps {
    category: ICategory;
    onClose: () => void;
}

export const EditCategoryModal = ({ category, onClose }: EditCategoryModalProps) => {
    const [name, setName] = useState(category.name);
    const [nameRu, setNameRu] = useState(category.nameRu || "");

    const { mutateAsync: updateCategory, isPending } = useUpdateCategory();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateCategory({ id: category.id, data: { name, nameRu } });
            onClose();
        } catch (error) {
            console.error("Turkumni yangilashda xatolik", error);
            alert("Turkum yangilanmadi.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Turkumni tahrirlash</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Turkum nomlarini yangilash
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-colors focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                                Turkum nomi (Uzb)
                            </label>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                                Turkum nomi (Rus)
                            </label>
                            <input
                                type="text"
                                value={nameRu}
                                onChange={(e) => setNameRu(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold transition-colors focus:outline-none"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Saqlanmoqda
                                </>
                            ) : (
                                "Saqlash"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
