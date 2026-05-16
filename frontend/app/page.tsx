"use client";

import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import { Package, ShoppingCart, Receipt, ArrowRight, DollarSign } from "lucide-react";

export default function Dashboard() {
  const { products, cart } = useAppContext();

  const totalProducts = products.length;
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotalValue = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "bg-blue-500",
      link: "/products",
    },
    {
      title: "Items in Cart",
      value: cartItemsCount,
      icon: ShoppingCart,
      color: "bg-indigo-500",
      link: "/billing",
    },
    {
      title: "Cart Value",
      value: `₹${cartTotalValue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-emerald-500",
      link: "/billing",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome to KINU's MART. Here is a summary of your billing system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link href={stat.link} key={index} className="block group">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors transform group-hover:translate-x-1" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{stat.title}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Ready to bill?</h2>
            <p className="text-blue-100 mb-6 max-w-sm">Create a new invoice quickly using our streamlined billing process.</p>
            <Link href="/billing" className="inline-flex items-center justify-center space-x-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors active:scale-95">
              <Receipt className="w-5 h-5" />
              <span>Start Billing</span>
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
            <Receipt className="w-64 h-64" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Manage Products</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Add, edit, or remove products from your inventory.</p>
          <Link href="/products" className="inline-flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors active:scale-95 w-fit">
            <Package className="w-5 h-5" />
            <span>Go to Inventory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
