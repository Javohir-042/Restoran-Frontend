import { Link, useLocation } from "react-router-dom";
import { adminNavigation } from "@/routes/admin/admin.navigation";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { SquareArrowLeft, X } from "lucide-react";
import API from "@/config/request";
import { useGeneralSettings } from "@/features/settings/useSettings";
import { useLanguage } from "@/context/LanguageContext";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
    const location = useLocation();
    const { logout, userRole } = useAuth();
    const { data: generalData } = useGeneralSettings();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const role = userRole || "MANAGER";

    const handleLogout = async () => {
        try {
            const isAdmin =
                role === "SUPER_ADMIN" ||
                role === "ADMIN" ||
                role === "MANAGER";
            const endpoint = isAdmin
                ? "/auth/admin/sign-out"
                : "/auth/staff/sign-out";
            await API.post(endpoint);
        } catch (err) {
            console.error("Logout failed on backend", err);
        } finally {
            logout();
            navigate("/login", { replace: true });
        }
    };



    return (
        <aside
            className={`
                fixed lg:sticky top-0 left-0 h-screen w-64 sm:w-[230px]
                bg-white dark:bg-[#18181b] border-r border-[#f1f3f5] dark:border-[#27272a] flex flex-col
                z-40 transition-all duration-200 ease-in-out shrink-0
                ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
            `}
        >
            {/* Brand */}
            <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-[19px] font-bold text-[#1a56db] dark:text-blue-400 tracking-tight">{generalData?.restaurantName || "RESTORAN"}</h1>
                    <p className="text-[11px] text-gray-500 dark:text-[#a1a1aa] font-medium mt-0.5">{t("Admin Terminal")}</p>
                </div>
                {/* Close button — only on mobile */}
                <button
                    onClick={onClose}
                    className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 sm:px-4 py-2 space-y-1.5 sm:space-y-2 overflow-y-auto mt-1 sm:mt-2">
                {adminNavigation.map((item) => {
                    const isActive =
                        location.pathname === item.path ||
                        (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            onClick={onClose}
                            className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-[10px] text-[13px] sm:text-[14px] font-medium transition-all duration-200 ${isActive
                                ? "bg-[#1a56db] dark:bg-[#27272a] text-white shadow-sm"
                                : "text-[#5b6b7a] dark:text-[#a1a1aa] hover:bg-gray-50 dark:hover:bg-[#27272a] hover:text-gray-900 dark:hover:text-[#e4e4e7]"
                                }`}
                        >
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            {t(item.label)}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="px-3 sm:px-5 py-4 sm:py-6 mt-auto">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-[#e02424] hover:text-red-700 transition-colors w-fit font-bold text-[13px] sm:text-[14px] group"
                >
                    <SquareArrowLeft size={18} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
                    {t("Chiqish")}
                </button>
            </div>
        </aside>
    );
};