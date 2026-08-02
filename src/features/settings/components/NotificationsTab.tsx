import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, BellDot, ChefHat, Package } from "lucide-react";
import { useNotificationSettings, useUpdateNotificationSettings } from "../useSettings";

const formSchema = z.object({
    notifyNewOrder: z.boolean(),
    notifyKitchenReady: z.boolean(),
    notifyLowInventory: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export const NotificationsTab = () => {
    const { data: notificationsData, isLoading } = useNotificationSettings();
    const { mutate: updateNotifications, isPending } = useUpdateNotificationSettings();

    const { handleSubmit, reset, watch, setValue } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            notifyNewOrder: true,
            notifyKitchenReady: true,
            notifyLowInventory: false,
        },
    });

    const notifyNewOrder = watch("notifyNewOrder");
    const notifyKitchenReady = watch("notifyKitchenReady");
    const notifyLowInventory = watch("notifyLowInventory");

    useEffect(() => {
        if (notificationsData) {
            reset({
                notifyNewOrder: notificationsData.notifyNewOrder,
                notifyKitchenReady: notificationsData.notifyKitchenReady,
                notifyLowInventory: notificationsData.notifyLowInventory,
            });
        }
    }, [notificationsData, reset]);

    const onSubmit = (values: FormValues) => {
        updateNotifications(values);
    };

    if (isLoading) return <div className="p-6">Yuklanmoqda...</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Bildirishnoma sozlamalari</h3>

                <div className="grid gap-4">
                    {/* Item 1 */}
                    <div className="flex justify-between items-center p-5 border border-gray-100 bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] rounded-2xl hover:border-blue-100 transition-colors">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                <BellDot className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Yangi buyurtma bildirishnomasi</h4>
                                <p className="text-xs text-gray-500 mt-1 max-w-[250px] sm:max-w-md">Mijoz buyurtma berganda dasturda va qurilmada tovushli signal berib ogohlantirish</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={notifyNewOrder}
                            onClick={() => setValue("notifyNewOrder", !notifyNewOrder, { shouldDirty: true })}
                            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-4 ${notifyNewOrder ? "bg-blue-600" : "bg-gray-300"
                                }`}
                        >
                            <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${notifyNewOrder ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>

                    {/* Item 2 */}
                    <div className="flex justify-between items-center p-5 border border-gray-100 bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] rounded-2xl hover:border-blue-100 transition-colors">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                                <ChefHat className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Oshxona tayyorlik signali</h4>
                                <p className="text-xs text-gray-500 mt-1 max-w-[250px] sm:max-w-md">Oshxonada taom tayyor bo'lganda, tasdiqlovchi xabarni ofitsiantga yuborish</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={notifyKitchenReady}
                            onClick={() => setValue("notifyKitchenReady", !notifyKitchenReady, { shouldDirty: true })}
                            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-4 ${notifyKitchenReady ? "bg-blue-600" : "bg-gray-300"
                                }`}
                        >
                            <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${notifyKitchenReady ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>

                    {/* Item 3 */}
                    <div className="flex justify-between items-center p-5 border border-gray-100 bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] rounded-2xl hover:border-blue-100 transition-colors">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Inventarizatsiya ogohlantirishlari</h4>
                                <p className="text-xs text-gray-500 mt-1 max-w-[250px] sm:max-w-md">Ombordagi zaxiralar belgilan miqdordan kam qolganda avtomatik xabar berish</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={notifyLowInventory}
                            onClick={() => setValue("notifyLowInventory", !notifyLowInventory, { shouldDirty: true })}
                            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-4 ${notifyLowInventory ? "bg-blue-600" : "bg-gray-300"
                                }`}
                        >
                            <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${notifyLowInventory ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                <button
                    type="button"
                    onClick={() => {
                        if (notificationsData) {
                            reset({
                                notifyNewOrder: notificationsData.notifyNewOrder,
                                notifyKitchenReady: notificationsData.notifyKitchenReady,
                                notifyLowInventory: notificationsData.notifyLowInventory,
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
