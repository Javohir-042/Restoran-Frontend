import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Camera, Eye, EyeOff } from "lucide-react";
import { createStaffSchema } from "./schema";
import { useCreateStaff } from "./useStaff";

type StaffFormValues = z.infer<typeof createStaffSchema>;

export const CreateStaffModal = ({ onClose }: { onClose: () => void }) => {
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showPin, setShowPin] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createStaff = useCreateStaff();

    const form = useForm<StaffFormValues>({
        resolver: zodResolver(createStaffSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            pinCode: "",
            role: undefined,
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const onSubmit = (data: StaffFormValues) => {
        createStaff.mutate(
            { data: data as any, avatar: avatarFile ?? undefined },
            { onSuccess: () => onClose() }
        );
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-base font-semibold text-gray-900">Yangi xodim qo'shish</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="p-5 space-y-4">
                    {/* Avatar upload */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-blue-400 transition-colors"
                        >
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="preview"
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

                    {/* Name fields */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600">Ism</label>
                            <input
                                {...form.register("firstName")}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
                            />
                            {form.formState.errors.firstName && (
                                <p className="text-xs text-red-500 mt-1">
                                    {form.formState.errors.firstName.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Familiya</label>
                            <input
                                {...form.register("lastName")}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
                            />
                            {form.formState.errors.lastName && (
                                <p className="text-xs text-red-500 mt-1">
                                    {form.formState.errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-xs font-medium text-gray-600">
                            Telefon raqami (ixtiyoriy)
                        </label>
                        <input
                            {...form.register("phoneNumber")}
                            placeholder="+998901234567"
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
                        />
                        {form.formState.errors.phoneNumber && (
                            <p className="text-xs text-red-500 mt-1">
                                {form.formState.errors.phoneNumber.message}
                            </p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="text-xs font-medium text-gray-600">Rol</label>
                        <select
                            {...form.register("role")}
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 bg-white"
                        >
                            <option value="">Tanlang...</option>
                            <option value="OFITSIANT">Ofitsiant</option>
                            <option value="OSHPAZ">Oshpaz</option>
                            <option value="KASSIR">Kassir</option>
                        </select>
                        {form.formState.errors.role && (
                            <p className="text-xs text-red-500 mt-1">
                                {form.formState.errors.role.message}
                            </p>
                        )}
                    </div>

                    {/* PIN */}
                    <div>
                        <label className="text-xs font-medium text-gray-600">PIN kod (4 xonali)</label>
                        <div className="relative mt-1">
                            <input
                                {...form.register("pinCode")}
                                type={showPin ? "text" : "password"}
                                maxLength={4}
                                inputMode="numeric"
                                placeholder="••••"
                                className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 tracking-widest"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPin(!showPin)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPin ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                        {form.formState.errors.pinCode && (
                            <p className="text-xs text-red-500 mt-1">
                                {form.formState.errors.pinCode.message}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={createStaff.isPending}
                            className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {createStaff.isPending ? "Saqlanmoqda..." : "Qo'shish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
