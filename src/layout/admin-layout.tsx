import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./admin-sidebar";
import { Search, User, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AdminProfileModal } from "./admin-profile-modal";

export const AdminLayout = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const { userName, userAvatar } = useAuth();

    return (
        <div className="flex h-screen w-full bg-[#f8f9fb] overflow-hidden relative">
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
                <header className="flex items-center justify-between bg-white border-b border-gray-100 px-3 sm:px-4 md:px-6 h-14 shrink-0">
                    {/* Left section: hamburger + search */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        {/* Hamburger — visible only on <lg */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors shrink-0"
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
                                placeholder="Search orders or menu..."
                                className="w-full pl-9 pr-3 py-1.5 bg-[#f1f3f5] border-transparent rounded-full text-[13px] text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-200 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <button
                            onClick={() => setProfileModalOpen(true)}
                            className="flex items-center gap-2 hover:bg-gray-50 py-1.5 px-2 rounded-lg transition-colors focus:outline-none"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0 border border-blue-200">
                                {userAvatar ? (
                                    <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-sm font-bold text-blue-600">
                                        {userName ? userName.charAt(0).toUpperCase() : <User size={16} />}
                                    </span>
                                )}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-semibold text-gray-900 leading-none">{userName || "Admin"}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">Admin profilini tahrirlash</p>
                            </div>
                        </button>
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