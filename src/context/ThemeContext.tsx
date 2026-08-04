import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

import { useAuth } from "../hooks/use-auth";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { userName } = useAuth();
    const storageKey = userName ? `app_theme_${userName}` : "app_theme";

    // Initialize with whatever is in storageKey, or fallback to generic
    const [theme, setTheme] = useState<Theme>(() => {
        // Read directly from localStorage to prevent flash on initial load
        const storedName = localStorage.getItem("userName");
        const key = storedName ? `app_theme_${storedName}` : "app_theme";
        const saved = localStorage.getItem(key);
        return (saved as Theme) || "light";
    });

    // When the storage key changes (e.g. user logs in or out), load their specific theme
    useEffect(() => {
        const saved = localStorage.getItem(storageKey) as Theme;
        if (saved) {
            setTheme(saved);
        } else if (!userName) {
            const generic = localStorage.getItem("app_theme") as Theme;
            if (generic) setTheme(generic);
        }
    }, [storageKey, userName]);

    useEffect(() => {
        localStorage.setItem(storageKey, theme);
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme, storageKey]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};
