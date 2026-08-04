import { useState, useRef } from "react";
import { X, Camera } from "lucide-react";
import { useCreateMenuItem } from "./useMenuItem";
import { useCategoriesAdminList } from "@/features/category/useCategory";
import { useLanguage } from "@/context/LanguageContext";

export const CreateMenuItemModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useCategoriesAdminList();
  const createMenuItem = useCreateMenuItem();
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!name || !nameRu || !price || !categoryId) return;
    createMenuItem.mutate(
      {
        data: {
          name,
          nameRu,
          description: description || undefined,
          price: Number(price),
          categoryId,
        },
        avatar: avatarFile ?? undefined,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#27272a] sticky top-0 bg-white dark:bg-[#18181b]">
          <h2 className="text-base font-semibold text-gray-900 dark:text-[#fafafa]">
            {t("Yangi taom qo'shish")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-[#fafafa] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-[#27272a] border-2 border-dashed border-gray-300 dark:border-[#3f3f46] flex items-center justify-center overflow-hidden hover:border-blue-400 dark:hover:border-blue-400 transition-colors"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera size={22} className="text-gray-400" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">
                {t("Nomi (o'zbek)")}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Osh Special"
                className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] text-gray-900 dark:text-[#fafafa] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">
                {t("Nomi (rus)")}
              </label>
              <input
                value={nameRu}
                onChange={(e) => setNameRu(e.target.value)}
                placeholder="Плов Special"
                className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] text-gray-900 dark:text-[#fafafa] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">
              {t("Tavsif (ixtiyoriy)")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] text-gray-900 dark:text-[#fafafa] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">
                {t("Narxi (so'm)")}
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="45000"
                className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] text-gray-900 dark:text-[#fafafa] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">
                {t("Turkum")}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm bg-white dark:bg-[#18181b] text-gray-900 dark:text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="">{t("Tanlang...")}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-[#27272a] text-sm text-gray-600 dark:text-[#a1a1aa] hover:bg-gray-50 dark:hover:bg-[#27272a] transition-colors"
            >
              {t("Bekor qilish")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={createMenuItem.isPending}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {createMenuItem.isPending ? t("Saqlanmoqda...") : t("Qo'shish")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
