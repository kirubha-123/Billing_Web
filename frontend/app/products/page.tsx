"use client";

import { useState } from "react";
import { normalizeBarcode, useAppContext, Product } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import { Plus, X, Search, Package } from "lucide-react";

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({ id: "", name: "", price: "", barcode: "" });
  const [isEditing, setIsEditing] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    normalizeBarcode(p.barcode).includes(normalizeBarcode(searchQuery))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) return;

    const productData = { name: formData.name, price, barcode: formData.barcode };

    if (isEditing) {
      updateProduct(formData.id, productData);
    } else {
      addProduct(productData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ id: "", name: "", price: "", barcode: "" });
    setIsEditing(false);
    setIsFormOpen(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({ 
      id: product.id, 
      name: product.name, 
      price: product.price.toString(),
      barcode: product.barcode || "" 
    });
    setIsEditing(true);
    setIsFormOpen(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Products</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your product inventory.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsFormOpen(true); }}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            <button onClick={resetForm} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Rice 10kg, Milk 1L"
                />
              </div>
              <div className="w-full sm:flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Barcode / SKU (Optional)</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                placeholder="e.g. 123456789012"
              />
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl font-bold transition-colors active:scale-95"
              >
                {isEditing ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 border-dashed">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No products found</h3>
          <p className="text-slate-500 dark:text-slate-400">Add some products to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              mode="management"
              onEdit={handleEdit}
              onDelete={deleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}
