import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useGeneralSettings, useUpdateGeneralSettings } from "../useSettings";

const formSchema = z.object({
    restaurantName: z.string().min(1, "Restoran nomi bo'sh bo'lishi mumkin emas"),
    contactPhone: z.string().min(1, "Kontakt telefon bo'sh bo'lishi mumkin emas"),
    address: z.string().min(1, "Manzil bo'sh bo'lishi mumkin emas"),
    currency: z.string().min(1, "Valyutani tanlang"),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const GeneralSettingsTab = () => {
    const { data: generalData, isLoading } = useGeneralSettings();
    const { mutate: updateGeneral, isPending } = useUpdateGeneralSettings();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            restaurantName: "",
            contactPhone: "",
            address: "",
            currency: "UZS",
            latitude: null,
            longitude: null,
        },
    });

    useEffect(() => {
        if (generalData) {
            reset({
                restaurantName: generalData.restaurantName || "",
                contactPhone: generalData.contactPhone || "",
                address: generalData.address || "",
                currency: generalData.currency || "UZS",
                latitude: generalData.latitude || null,
                longitude: generalData.longitude || null,
            });
        }
    }, [generalData, reset]);

    const onSubmit = (values: FormValues) => {
        updateGeneral({
            ...values,
            latitude: values.latitude || undefined,
            longitude: values.longitude || undefined,
        });
    };

    if (isLoading) return <div className="p-6">Yuklanmoqda...</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Restoran nomi</label>
                    <input
                        {...register("restaurantName")}
                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all hover:bg-gray-50"
                        placeholder="RESTORAN Premium"
                    />
                    {errors.restaurantName && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.restaurantName.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Kontakt telefon</label>
                    <input
                        {...register("contactPhone")}
                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all hover:bg-gray-50"
                        placeholder="+998 90 123 45 67"
                    />
                    {errors.contactPhone && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.contactPhone.message}</p>
                    )}
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Manzil</label>
                    <input
                        {...register("address")}
                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all hover:bg-gray-50"
                        placeholder="Toshkent sh., Yunusobod tumani"
                    />
                    {errors.address && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.address.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Valyuta</label>
                    <select
                        {...register("currency")}
                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all hover:bg-gray-50 cursor-pointer appearance-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: `right 0.5rem center`,
                            backgroundRepeat: `no-repeat`,
                            backgroundSize: `1.5em 1.5em`,
                            paddingRight: `2.5rem`
                        }}
                    >
                        <option value="UZS">O'zbek so'mi (UZS)</option>
                        <option value="USD">AQSh dollari (USD)</option>
                    </select>
                    {errors.currency && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.currency.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-8 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => {
                        if (generalData) {
                            reset({
                                restaurantName: generalData.restaurantName || "",
                                contactPhone: generalData.contactPhone || "",
                                address: generalData.address || "",
                                currency: generalData.currency || "UZS",
                            });
                        }
                    }}
                    className="px-5 py-2.5 rounded-xl text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                    Bekor qilish
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-[#1a56db] text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Save className="w-4 h-4" />
                    {isPending ? "Saqlanmoqda..." : "Saqlash"}
                </button>
            </div>
        </form>
    );
};
