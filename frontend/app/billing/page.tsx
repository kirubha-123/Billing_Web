"use client";

import { useState } from "react";
import { normalizeBarcode, useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import CartItem from "@/components/CartItem";
import BarcodeScanner from "@/components/BarcodeScanner";
import { Search, ShoppingBag, ArrowRight, ScanBarcode } from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
  const { products, cart, addToCart } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    normalizeBarcode(p.barcode).includes(normalizeBarcode(searchQuery))
  );

  const handleScan = (decodedText: string) => {
    if (!decodedText || decodedText.trim() === "") return;
    setIsScanning(false);
    
    const cleanScanned = normalizeBarcode(decodedText);
    
    const product = products.find(p => {
      const productBarcode = normalizeBarcode(p.barcode);
      return productBarcode === cleanScanned || p.id === decodedText.trim();
    });
    if (product) {
      addToCart(product);
      alert(`Added ${product.name} to cart!`);
    } else {
      alert(`No product found with barcode: ${decodedText}`);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = cartTotal * 0.1; // 10% tax example
  const finalTotal = cartTotal + tax;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isScanning && (
        <BarcodeScanner 
          onScan={handleScan} 
          onClose={() => setIsScanning(false)} 
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Billing</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Select products and create invoice.</p>
        </div>
        <button
          onClick={() => setIsScanning(true)}
          className="flex items-center justify-center space-x-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-medium transition-colors active:scale-95"
        >
          <ScanBarcode className="w-5 h-5" />
          <span>Scan Barcode</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Products List */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by name or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
              />
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleScan(searchQuery.trim());
              }}
              className="flex-shrink-0"
            >
              <button 
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-2xl font-bold transition-colors shadow-sm"
              >
                Add Typed Barcode
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                mode="billing"
                onAddToCart={addToCart}
              />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
                No products found.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sticky Cart Panel */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 flex flex-col max-h-[calc(100vh-8rem)]">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Current Order</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{cart.length} items</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2 mb-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-slate-400 text-center">
                  <ShoppingBag className="w-10 h-10 mb-2 opacity-20" />
                  <p>Cart is empty</p>
                </div>
              ) : (
                cart.map(item => <CartItem key={item.id} item={item} />)
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3 mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-white">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax (10%)</span>
                <span className="font-medium text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/invoice"
              className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-bold transition-all active:scale-95 ${
                cart.length > 0
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 pointer-events-none"
              }`}
            >
              <span>Generate Invoice</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
