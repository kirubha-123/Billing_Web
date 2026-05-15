"use client";

import { CartItem as CartItemType, useAppContext } from "@/context/AppContext";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateCartItemQuantity, removeFromCart } = useAppContext();

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-3 border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
      <div className="flex-1 min-w-0 pr-4">
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">
          {item.name}
        </h4>
        <div className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">
          ${(item.price * item.quantity).toFixed(2)}
          <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
            (${item.price.toFixed(2)} each)
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm overflow-hidden">
          <button
            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
            className="p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors active:bg-slate-200 dark:active:bg-slate-500"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-semibold text-slate-800 dark:text-slate-200 text-sm">
            {item.quantity}
          </span>
          <button
            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
            className="p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors active:bg-slate-200 dark:active:bg-slate-500"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
