import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AdminSidebar } from "./admin-sidebar";
import { Search, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { AdminProfileModal } from "./admin-profile-modal";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export const AdminLayout = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            const query = searchQuery.trim();
            const dest = pathname.includes('/admin/orders') ? '/admin/orders' : '/admin/menu';
            navigate(`${dest}?search=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#f8f9fb] dark:bg-[#09090b] overflow-hidden relative transition-colors duration-200">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between bg-white dark:bg-[#18181b] border-b border-gray-100 dark:border-[#27272a] px-3 sm:px-4 md:px-6 h-14 shrink-0 transition-colors duration-200">
                    {/* Left section: hamburger + search */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        {/* Hamburger — visible only on <lg */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 dark:text-[#a1a1aa] hover:text-gray-700 dark:hover:text-gray-300 transition-colors shrink-0"
                        >
                            <Menu size={22} />
                        </button>

                        {/* Search — hidden on very small screens */}
                        <div className="relative w-full max-w-xs hidden sm:block">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder={t("Search orders or menu...")}
                                className="w-full pl-9 pr-3 py-1.5 bg-[#f1f3f5] dark:bg-[#27272a] border-transparent rounded-full text-[13px] text-gray-700 dark:text-[#e4e4e7] placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-200 dark:focus:border-blue-500/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Right section: Theme & Language Toggle */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-1.5 text-gray-500 dark:text-[#a1a1aa] hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors border border-transparent dark:border-[#27272a]"
                            title="Toggle Dark Mode"
                        >
                            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

                        <div className="flex items-center bg-gray-100/80 dark:bg-[#27272a] p-0.5 rounded-lg border border-gray-200/60 dark:border-[#27272a] shadow-sm transition-colors">
                            <button
                                onClick={() => setLanguage("uz")}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all sm:px-3 ${language === "uz"
                                    ? "bg-white dark:bg-[#27272a] text-blue-600 dark:text-[#fafafa] shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                    : "text-gray-500 dark:text-[#a1a1aa] hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-[#27272a]"
                                    }`}
                            >
                                UZB
                            </button>
                            <button
                                onClick={() => setLanguage("ru")}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all sm:px-3 ${language === "ru"
                                    ? "bg-white dark:bg-[#27272a] text-blue-600 dark:text-[#fafafa] shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                    : "text-gray-500 dark:text-[#a1a1aa] hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-[#27272a]"
                                    }`}
                            >
                                RUS
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
                    <Outlet />
                </div>
            </main>

            {/* Profile Modal */}
            {profileModalOpen && (
                <AdminProfileModal onClose={() => setProfileModalOpen(false)} />
            )}
        </div>
    );
};