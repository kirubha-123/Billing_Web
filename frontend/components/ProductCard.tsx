"use client";

import { Product } from "@/context/AppContext";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  mode?: "billing" | "management";
}

export default function ProductCard({
  product,
  onAddToCart,
  onEdit,
  onDelete,
  mode = "billing"
}: ProductCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-200 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            ₹{product.price.toFixed(2)}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
          {product.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {mode === "billing" ? (
        <button
          onClick={() => onAddToCart && onAddToCart(product)}
          className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition-colors active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      ) : (
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit && onEdit(product)}
            className="flex-1 flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl font-medium transition-colors active:scale-[0.98]"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete && onDelete(product.id)}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 py-2.5 rounded-xl font-medium transition-colors active:scale-[0.98]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
