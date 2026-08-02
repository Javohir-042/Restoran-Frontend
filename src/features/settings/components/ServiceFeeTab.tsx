import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useServiceFee, useUpdateServiceFee } from "../useSettings";

const formSchema = z.object({
    percent: z.number().min(0).max(100, "100 dan oshmasligi kerak"),
    autoApply: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export const ServiceFeeTab = () => {
    const { data: serviceFeeData, isLoading } = useServiceFee();
    const { mutate: updateServiceFee, isPending } = useUpdateServiceFee();

    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            percent: 15,
            autoApply: true,
        },
    });

    const autoApply = watch("autoApply");

    useEffect(() => {
        if (serviceFeeData) {
            reset({
                percent: serviceFeeData.serviceFeePercent || 0,
                autoApply: serviceFeeData.autoApplyServiceFee || false,
            });
        }
    }, [serviceFeeData, reset]);

    const onSubmit = (values: FormValues) => {
        updateServiceFee({
            percent: values.percent,
            autoApply: values.autoApply,
        });
    };

    if (isLoading) return <div className="p-6">Yuklanmoqda...</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="border border-gray-200/60 rounded-2xl p-6 md:p-8 space-y-8 bg-white shadow-sm ring-1 ring-black/[0.02]">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-8 border-b border-gray-100 gap-4">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Xizmat haqi foizi</h3>
                        <p className="text-sm text-gray-500 mt-1.5">Har bir buyurtmaga qo'shiladigan foiz miqdori</p>
                    </div>
                    <div className="flex items-center gap-3 relative">
                        <div className="relative">
                            <input
                                type="number"
                                {...register("percent", { valueAsNumber: true })}
                                className="w-24 px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all text-center font-semibold text-lg hover:bg-gray-50"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</span>
                        </div>
                        {errors.percent && (
                            <p className="text-red-500 text-xs mt-1 absolute -bottom-5 w-full text-center font-medium">{errors.percent.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Avtomatik hisobga qo'shish</h3>
                        <p className="text-sm text-gray-500 mt-1.5">Check chiqarilganda xizmat haqi avtomatik hisoblanadi</p>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={autoApply}
                        onClick={() => setValue("autoApply", !autoApply, { shouldDirty: true })}
                        className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${autoApply ? "bg-blue-600" : "bg-gray-300"
                            }`}
                    >
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${autoApply ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </button>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => {
                        if (serviceFeeData) {
                            reset({
                                percent: serviceFeeData.serviceFeePercent || 0,
                                autoApply: serviceFeeData.autoApplyServiceFee || false,
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
