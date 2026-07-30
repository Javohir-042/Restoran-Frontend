import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { X } from "lucide-react";
import { updateStaffSchema, changePinSchema } from "./schema";
import { useUpdateStaff, useChangePin } from "./useStaff";
import type { IStaff } from "./types";

type UpdateInput = z.input<typeof updateStaffSchema>;
type UpdateOutput = z.output<typeof updateStaffSchema>;
type PinInput = z.input<typeof changePinSchema>;
type PinOutput = z.output<typeof changePinSchema>;

export const EditStaffModal = ({
    staff,
    onClose,
}: {
    staff: IStaff;
    onClose: () => void;
}) => {
    const [tab, setTab] = useState<"info" | "pin">("info");
    const updateStaff = useUpdateStaff();
    const changePin = useChangePin();

    const infoForm = useForm<UpdateInput, any, UpdateOutput>({
        resolver: zodResolver(updateStaffSchema),
        defaultValues: {
            firstName: staff.firstName,
            lastName: staff.lastName,
            phoneNumber: staff.phoneNumber ?? "",
            role: staff.role,
        },
    });

    const pinForm = useForm<PinInput, any, PinOutput>({
        resolver: zodResolver(changePinSchema),
        defaultValues: { newPin: "" },
    });

    const onInfoSubmit = (data: UpdateOutput) => {
        updateStaff.mutate({ id: staff.id, data }, { onSuccess: () => onClose() });
    };

    const onPinSubmit = (data: PinOutput) => {
        changePin.mutate(
            { id: staff.id, newPin: data.newPin },
            { onSuccess: () => pinForm.reset() }
        );
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900 truncate">
                        {staff.firstName} {staff.lastName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 ml-2"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-5">
                    <button
                        onClick={() => setTab("info")}
                        className={`px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === "info"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        Ma'lumotlar
                    </button>
                    <button
                        onClick={() => setTab("pin")}
                        className={`px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === "pin"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        PIN kod
                    </button>
                </div>

                {/* Info tab */}
                {tab === "info" ? (
                    <form
                        onSubmit={infoForm.handleSubmit(onInfoSubmit)}
                        className="p-5 space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-gray-600">Ism</label>
                                <input
                                    {...infoForm.register("firstName")}
                                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
                                />
                                {infoForm.formState.errors.firstName && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {infoForm.formState.errors.firstName.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600">Familiya</label>
                                <input
                                    {...infoForm.register("lastName")}
                                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
                                />
                                {infoForm.formState.errors.lastName && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {infoForm.formState.errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Telefon</label>
                            <input
                                {...infoForm.register("phoneNumber")}
                                placeholder="+998901234567"
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
                            />
                            {infoForm.formState.errors.phoneNumber && (
                                <p className="text-xs text-red-500 mt-1">
                                    {infoForm.formState.errors.phoneNumber.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Rol</label>
                            <select
                                {...infoForm.register("role")}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 bg-white"
                            >
                                <option value="OFITSIANT">Ofitsiant</option>
                                <option value="OSHPAZ">Oshpaz</option>
                                <option value="KASSIR">Kassir</option>
                            </select>
                        </div>
                        <div className="flex gap-2 pt-1">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Bekor qilish
                            </button>
                            <button
                                type="submit"
                                disabled={updateStaff.isPending}
                                className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {updateStaff.isPending ? "Saqlanmoqda..." : "Saqlash"}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* PIN tab */
                    <form
                        onSubmit={pinForm.handleSubmit(onPinSubmit)}
                        className="p-5 space-y-4"
                    >
                        <p className="text-xs text-gray-500">
                            Yangi PIN kod kiritilganda xodimning eski PIN kodi o'chiriladi.
                        </p>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Yangi PIN kod</label>
                            <input
                                {...pinForm.register("newPin")}
                                maxLength={4}
                                inputMode="numeric"
                                placeholder="••••"
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 tracking-widest"
                            />
                            {pinForm.formState.errors.newPin && (
                                <p className="text-xs text-red-500 mt-1">
                                    {pinForm.formState.errors.newPin.message}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={changePin.isPending}
                            className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {changePin.isPending ? "Yangilanmoqda..." : "PIN kodni yangilash"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
