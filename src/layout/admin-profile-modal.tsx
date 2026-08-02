import { useState, useRef } from "react";
import { X, Camera } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const AdminProfileModal = ({ onClose }: { onClose: () => void }) => {
    const { userName, userAvatar, updateProfile } = useAuth();
    const [name, setName] = useState(userName || "");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(userAvatar);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        updateProfile(name, avatarPreview);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">Profilni tahrirlash</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-3">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-blue-400 transition-colors relative group"
                        >
                            {avatarPreview ? (
                                <>
                                    <img
                                        src={avatarPreview}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={20} className="text-white" />
                                    </div>
                                </>
                            ) : (
                                <Camera size={22} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                            )}
                        </button>
                        <p className="text-xs text-gray-500 font-medium">Rasm yuklash</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Name Input */}
                    <div>
                        <label className="text-xs font-medium text-gray-600">Ism-familiya</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ismingizni kiriting"
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!name.trim()}
                            className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            Saqlash
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
