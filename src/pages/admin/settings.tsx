import { useState } from "react";
import { GeneralSettingsTab } from "@/features/settings/components/GeneralSettingsTab";
import { ServiceFeeTab } from "@/features/settings/components/ServiceFeeTab";
import { SecurityTab } from "@/features/settings/components/SecurityTab";
import { NotificationsTab } from "@/features/settings/components/NotificationsTab";
import { Settings as SettingsIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Settings = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<"general" | "serviceFee" | "security" | "notifications">("general");

    const tabs = [
        { id: "general", label: t("Umumiy") },
        { id: "serviceFee", label: t("Xizmat haqi") },
        { id: "security", label: t("Xavfsizlik") },
        { id: "notifications", label: t("Bildirishnomalar") },
    ] as const;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-[#1a56db] rounded-xl shadow-sm border border-blue-100">
                    <SettingsIcon className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#fafafa]">{t("Sozlamalar")}</h1>
                    <p className="text-sm text-gray-500 dark:text-[#a1a1aa] mt-1">
                        {t("Tizim parametrlarini boshqarish va moslashtirish")}
                    </p>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-[#18181b] rounded-2xl shadow-sm border border-gray-200 dark:border-[#27272a]/60 overflow-hidden ring-1 ring-black/[0.03]">
                {/* Tabs */}
                <div className="border-b bg-gray-50 dark:bg-[#27272a]/50 px-4 sm:px-8 flex overflow-x-auto gap-6 sm:gap-8 no-scrollbar pt-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 px-1 text-sm font-medium transition-all duration-300 border-b-2 relative whitespace-nowrap ${activeTab === tab.id
                                ? "border-[#1a56db] text-[#1a56db] dark:text-blue-400"
                                : "border-transparent text-gray-400 dark:text-[#71717a] hover:text-gray-700 dark:text-[#f4f4f5] hover:border-gray-300"
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1a56db] rounded-t-full shadow-[0_0_8px_rgba(26,86,219,0.5)]"></span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-6 md:p-8 min-h-[500px]">
                    <div className="max-w-3xl">
                        {activeTab === "general" && <GeneralSettingsTab />}
                        {activeTab === "serviceFee" && <ServiceFeeTab />}
                        {activeTab === "security" && <SecurityTab />}
                        {activeTab === "notifications" && <NotificationsTab />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
