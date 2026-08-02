import type { ICategory } from "@/features/customer/types";

export const CategoryTabs = ({
    categories,
    activeCategoryId,
    onSelect,
}: {
    categories: ICategory[];
    activeCategoryId: string | null;
    onSelect: (id: string | null) => void;
}) => {
    return (
        <div className="overflow-x-auto no-scrollbar scroll-smooth pl-4 pr-4 py-2 border-b border-gray-100 sticky top-[68px] z-10 bg-white/90 backdrop-blur-md">
            <div className="flex gap-2 w-max">
                <button
                    onClick={() => onSelect(null)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all whitespace-nowrap border-2 ${activeCategoryId === null
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30"
                            : "bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:text-blue-600"
                        }`}
                >
                    Barchasi
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onSelect(cat.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all whitespace-nowrap border-2 ${activeCategoryId === cat.id
                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30"
                                : "bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:text-blue-600"
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
};
