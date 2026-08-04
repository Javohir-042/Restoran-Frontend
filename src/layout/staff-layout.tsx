import { Outlet } from "react-router-dom";
import { LogoutButton } from "@/custom/logout-button";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const LiveClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <span className="font-mono text-lg font-bold text-gray-700 dark:text-[#fafafa] tracking-tight bg-gray-100 dark:bg-[#27272a] px-3 py-1 rounded-lg transition-colors">
            {time.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
    );
};

export const StaffLayout = () => {
    const userName = localStorage.getItem("userName") || "Xodim";
    const userRole = localStorage.getItem("userRole") || "Xodim";

    const { language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-[#050508] overflow-hidden transition-colors duration-200 relative">

            {/* Ambient Background Glows for Dark Mode */}
            <div className="absolute inset-0 z-0 pointer-events-none hidden dark:block">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[130px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[130px]" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: "radial-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px)",
                        backgroundSize: "32px 32px"
                    }}
                />
            </div>

            <header className="relative z-10 flex items-center justify-between bg-white dark:bg-[#09090b]/60 dark:backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-4 md:px-6 py-3 shrink-0 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-start pr-1">
                        <span className="text-lg font-bold text-gray-900 dark:text-[#fafafa] leading-tight">{userName}</span>
                        <span className="text-xs text-gray-500 dark:text-[#a1a1aa] font-bold uppercase tracking-widest leading-none mt-1">{userRole}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                </div>

                {/* Center: Live Clock for tablet workers */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <LiveClock />
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    {/* Portal target for page-specific header actions (like notification bell) */}
                    <div id="staff-header-actions" className="flex items-center"></div>

                    <button
                        onClick={toggleTheme}
                        className="p-1.5 text-gray-500 dark:text-[#a1a1aa] hover:bg-gray-100 dark:hover:bg-[#27272a] rounded-lg transition-colors border border-transparent dark:border-[#27272a]"
                        title="Toggle Dark Mode"
                    >
                        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    <div className="hidden sm:flex items-center bg-gray-100/80 dark:bg-[#18181b] p-0.5 rounded-lg border border-gray-200/60 dark:border-[#27272a] shadow-sm transition-colors">
                        <button
                            onClick={() => setLanguage("uz")}
                            className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${language === "uz"
                                ? "bg-white dark:bg-[#27272a] text-blue-600 dark:text-[#fafafa] shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                : "text-gray-500 dark:text-[#71717a] hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            UZB
                        </button>
                        <button
                            onClick={() => setLanguage("ru")}
                            className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${language === "ru"
                                ? "bg-white dark:bg-[#27272a] text-blue-600 dark:text-[#fafafa] shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                : "text-gray-500 dark:text-[#71717a] hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            RUS
                        </button>
                    </div>


                    <LogoutButton />
                </div>
            </header>

            <main className="relative z-10 flex-1 overflow-y-auto p-4 md:p-6">
                <Outlet />
            </main>
        </div>
    );
};
