import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/providers/ClientProviders";

export const metadata: Metadata = {
    title: "Media Shelf",
    description: "A personal media shelf for tracking movies and TV shows",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Media Shelf",
    },
}

export const viewport: Viewport = {
    themeColor: "#ffffff",
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#content"
          className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 z-50
                      rounded-md bg-white px-3 py-2 text-sm font-medium text-black shadow`}
        >
          Skip to content
        </a>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
