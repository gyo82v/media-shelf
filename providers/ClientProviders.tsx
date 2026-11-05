"use client"

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/providers/AuthProvider";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}