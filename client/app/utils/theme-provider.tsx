'use client'
import * as React from "react";
import { ThemeProvider as NexThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({children, ...props} : ThemeProviderProps) {
    return (
        <NexThemesProvider {...props}>
            {children}
        </NexThemesProvider>
    );
};