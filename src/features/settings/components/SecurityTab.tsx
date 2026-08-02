import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import API from "@/config/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosErrorResponse } from "@/types/types";
import { useToggle2FA } from "../useSettings";

const formSchema = z
    .object({
        oldPassword: z.string().min(1, "Hozirgi parolni kiriting"),
        newPassword: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
        confirmPassword: z.string().min(1, "Parolni tasdiqlang"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Parollar mos kelmadi",
        path: ["confirmPassword"],
    });

type FormValues = z.infer<typeof formSchema>;

export const SecurityTab = () => {
    const { data: adminData } = useQuery({
        queryKey: ["admin", "me"],
        queryFn: () => API.get("/admins/me").then((res) => res.data.data),
    });

    const { mutate: toggle2FA, isPending: isToggling2FA } = useToggle2FA();

    const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
        mutationFn: (data: Omit<FormValues, "confirmPassword">) =>
            API.patch("/admins/me/password", data),
        onSuccess: () => {
            toast.success("Parol muvaffaqiyatli o'zgartirildi");
            reset();
        },
        onError: (error: AxiosErrorResponse) => {
            const msg = error.response?.data?.error?.message;
            toast.error(typeof msg === "string" ? msg : "Parolni o'zgartirishda xatolik");
        },
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: FormValues) => {
        changePassword({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
        });
    };

    const is2FAEnabled = adminData?.is2FAEnabled || false;

    return (
        <div className="space-y-10">
            {/* Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 border-b border-gray-100 pb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Lock className="w-5 h-5" />
                        </div>
                        Parolni o'zgartirish
                    </h3>
                </div>

                <div className="max-w-md space-y-5 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Hozirgi parol</label>
                        <input
                            type="password"
                            {...register("oldPassword")}
                            className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all hover:bg-gray-50"
                            placeholder="••••••••"
                        />
                        {errors.oldPassword && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.oldPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Yangi parol</label>
                        <input
                            type="password"
                            {...register("newPassword")}
                            className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all hover:bg-gray-50"
                            placeholder="••••••••"
                        />
                        {errors.newPassword && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Yangi parolni tasdiqlash</label>
                        <input
                            type="password"
                            {...register("confirmPassword")}
                            className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all hover:bg-gray-50"
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-start gap-3 max-w-md pt-4">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="px-5 py-2.5 rounded-xl text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        Bekor qilish
                    </button>
                    <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-[#1a56db] text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <Save className="w-4 h-4" />
                        {isChangingPassword ? "Saqlanmoqda..." : "Saqlash"}
                    </button>
                </div>
            </form>

            {/* 2FA Toggle */}
            <div className="border border-green-100/60 rounded-2xl p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/30 flex items-start justify-between shadow-sm ring-1 ring-black/[0.02]">
                <div className="flex gap-4">
                    <div className="mt-1 w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 shadow-sm border border-green-200/50">
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Ikki bosqichli autentifikatsiya (2FA)</h3>
                        <p className="text-sm text-gray-500 mt-1.5 max-w-md leading-relaxed">
                            Tizimga kirishda joriy paroldan tashqari qo'shimcha maxsus xavfsizlik kodini kiritish zarur bo'ladi. Bu akkauntingiz xavfsizligini sezilarli darajada oshiradi.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    role="switch"
                    aria-checked={is2FAEnabled}
                    disabled={isToggling2FA}
                    onClick={() => toggle2FA()}
                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-2 ${is2FAEnabled ? "bg-green-500" : "bg-gray-300"
                        } ${isToggling2FA ? "opacity-50" : ""}`}
                >
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${is2FAEnabled ? "translate-x-5" : "translate-x-0"
                            }`}
                    />
                </button>
            </div>
        </div>
    );
};
