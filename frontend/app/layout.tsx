import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Billing App",
  description: "A fast, modern billing and invoice web application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
        <ThemeProvider>
          <AppProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                {children}
              </main>
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
