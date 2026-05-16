"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext";
import { LayoutDashboard, Package, Receipt, FileText, Moon, Sun, ShoppingCart, Settings } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { cart } = useAppContext();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: Package },
    { name: "Billing", href: "/billing", icon: Receipt },
    { name: "Invoice", href: "/invoice", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              K
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">KINU's MART</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile Nav Links (simplified) */}
            <div className="flex md:hidden space-x-1 mr-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`p-2 rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>

            <Link href="/billing" className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
