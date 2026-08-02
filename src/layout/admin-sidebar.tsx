import { Link, useLocation } from "react-router-dom";
import { adminNavigation } from "@/routes/admin/admin.navigation";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { SquareArrowLeft, X } from "lucide-react";
import API from "@/config/request";
import { useGeneralSettings } from "@/features/settings/useSettings";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
    const location = useLocation();
    const { logout, userRole, userName: authUserName, userAvatar } = useAuth();
    const { data: generalData } = useGeneralSettings();
    const navigate = useNavigate();

    // Fallback names if not in auth state
    const userName = authUserName || "John Doe";
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

    const roleLabelMap: Record<string, string> = {
        SUPER_ADMIN: "SUPER ADMIN",
        ADMIN: "MANAGER",
    };

    const displayRole = roleLabelMap[role] || role;

    // Get initials for avatar (e.g. "John Doe" -> "JD")
    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <aside
            className={`
                fixed lg:sticky top-0 left-0 h-screen w-64 sm:w-[230px]
                bg-white border-r border-[#f1f3f5] flex flex-col
                z-40 transition-transform duration-200 ease-in-out shrink-0
                ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
            `}
        >
            {/* Brand */}
            <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-[19px] font-bold text-[#1a56db] tracking-tight">{generalData?.restaurantName || "RESTORAN"}</h1>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">Admin Terminal</p>
                </div>
                {/* Close button — only on mobile */}
                <button
                    onClick={onClose}
                    className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors"
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
                                ? "bg-[#1a56db] text-white shadow-sm"
                                : "text-[#5b6b7a] hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="px-3 sm:px-5 py-4 sm:py-6 mt-auto">
                <div className="flex flex-col gap-4 sm:gap-5">
                    {/* User profile */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e8f1ff] flex items-center justify-center text-[#1a56db] text-[12px] sm:text-[13px] font-bold overflow-hidden shrink-0 border border-blue-100">
                            {userAvatar ? (
                                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                initials
                            )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="text-[13px] sm:text-[14px] font-bold text-[#1f2937] truncate leading-none mb-1.5">{userName}</p>
                            <p className="text-[10px] text-[#6b7280] uppercase tracking-wider font-bold leading-none truncate">
                                {displayRole}
                            </p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-[#e02424] hover:text-red-700 transition-colors w-fit font-bold text-[13px] sm:text-[14px] group"
                    >
                        <SquareArrowLeft size={18} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
                        Chiqish
                    </button>
                </div>
            </div>
        </aside>
    );
};