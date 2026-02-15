'use client';
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
    themeMode: "light",
    toggleTheme: () => { },
});

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("themeMode") || "light";
        setThemeMode(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }, []);

    const toggleTheme = () => {
        const newTheme = themeMode === "light" ? "dark" : "light";
        setThemeMode(newTheme);
        localStorage.setItem("themeMode", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    return (
        <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
