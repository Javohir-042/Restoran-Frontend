import { Outlet } from "react-router-dom";
import { LogoutButton } from "@/custom/logout-button";
import { useState, useEffect } from "react";
import { useGeneralSettings } from "@/features/settings/useSettings";

const LiveClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <span className="font-mono text-lg font-bold text-gray-700 tracking-tight bg-gray-100 px-3 py-1 rounded-lg">
            {time.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
    );
};

export const StaffLayout = () => {
    const userName = localStorage.getItem("userName") || "Xodim";
    const userRole = localStorage.getItem("userRole") || "Xodim";

    const { data: generalData } = useGeneralSettings();

    return (
        <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden">
            <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 md:px-6 py-3 shrink-0">
                <h1 className="text-sm font-bold text-blue-600 tracking-tight hidden sm:block">
                    {generalData?.restaurantName || "RESTORAN"} <span className="text-gray-400 font-medium">| {userRole} Terminal</span>
                </h1>

                {/* Center: Live Clock for tablet workers */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <LiveClock />
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    {/* Portal target for page-specific header actions (like notification bell) */}
                    <div id="staff-header-actions" className="flex items-center"></div>

                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-semibold text-gray-800">{userName}</span>
                        <span className="text-[10px] text-gray-400 tracking-wider uppercase font-medium">{userRole}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="w-px h-6 bg-gray-200 mx-1"></div>
                    <LogoutButton />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <Outlet />
            </main>
        </div>
    );
};
