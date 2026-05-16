"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore, ReactNode } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  barcode?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShopDetails {
  name: string;
  address: string;
  phone: string;
  gstNumber: string;
}

export const normalizeBarcode = (value?: string | null) =>
  value ? value.replace(/\s+/g, "").toLowerCase() : "";

const defaultProducts: Product[] = [
  { id: "1", name: "Basmati Rice 10kg", price: 450, barcode: "8901234567890" },
  { id: "2", name: "Cooking Oil 5L", price: 580, barcode: "8901234567891" },
  { id: "3", name: "Sugar 1kg", price: 45, barcode: "8901234567892" },
  { id: "4", name: "Milk 1L", price: 65, barcode: "8901234567893" },
  { id: "5", name: "Bread", price: 40, barcode: "8901234567894" },
  { id: "6", name: "Eggs Dozen", price: 90, barcode: "8901234567895" },
  { id: "7", name: "Chicken 1kg", price: 250, barcode: "8901234567896" },
  { id: "8", name: "Fresh Vegetables Mix", price: 120, barcode: "8901234567897" },
  { id: "9", name: "Tea Leaves 500g", price: 180, barcode: "8901234567898" },
  { id: "10", name: "Coffee Powder 200g", price: 220, barcode: "8901234567899" },
];

const defaultShopDetails: ShopDetails = {
  name: "KINU's MART",
  address: "123 Main Street, City, Country",
  phone: "+1 234 567 890",
  gstNumber: "GST123456789",
};

const defaultAppState = {
  products: defaultProducts,
  cart: [] as CartItem[],
  shopDetails: defaultShopDetails,
};

type AppState = typeof defaultAppState;

let appState: AppState = defaultAppState;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const emitChange = () => {
  listeners.forEach(listener => listener());
};

const readStoredValue = <T,>(key: string): T | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = localStorage.getItem(key);
  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    console.error(`Failed to parse ${key} from local storage`);
    return null;
  }
};

const persistState = () => {
  // Don't persist products to localStorage - they're managed by backend API
  // Only persist cart and shop details for local UX
  localStorage.setItem("billing_cart", JSON.stringify(appState.cart));
  localStorage.setItem("billing_shop", JSON.stringify(appState.shopDetails));
};

const hydrateStateFromStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  // Don't load products from localStorage - they're fetched from backend API
  // Only load cart and shop details from storage
  const storedCart = readStoredValue<CartItem[]>("billing_cart");
  const storedShop = readStoredValue<ShopDetails>("billing_shop");

  appState = {
    products: defaultProducts, // Will be replaced by backend fetch
    cart: storedCart ?? [],
    shopDetails: storedShop ?? defaultShopDetails,
  };

  emitChange();
};

const setAppState = (nextState: AppState) => {
  appState = nextState;

  if (typeof window !== "undefined") {
    persistState();
  }

  emitChange();
};

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  shopDetails: ShopDetails;
  updateShopDetails: (details: ShopDetails) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const appSnapshot = useSyncExternalStore(subscribe, () => appState, () => defaultAppState);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/products`);
        if (response.ok) {
          const backendProducts = await response.json();
          // Convert backend format to app format
          const formattedProducts = backendProducts.map((p: any) => ({
            id: p._id || p.id,
            name: p.name,
            price: p.price,
            barcode: p.barcode,
          }));
          setAppState({
            ...appState,
            products: formattedProducts && formattedProducts.length > 0 ? formattedProducts : defaultProducts,
          });
        } else {
          hydrateStateFromStorage();
        }
      } catch (error) {
        console.error('Failed to fetch products from backend:', error);
        hydrateStateFromStorage();
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const { products, cart, shopDetails } = appSnapshot;

  const updateShopDetails = (details: ShopDetails) => {
    setAppState({ ...appState, shopDetails: details });
  };

  const addProduct = async (productData: Omit<Product, "id">) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        const newProduct = await response.json();
        setAppState({
          ...appState,
          products: [...products, { id: newProduct._id, name: newProduct.name, price: newProduct.price, barcode: newProduct.barcode }],
        });
      } else {
        console.error('Failed to add product to backend');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (id: string, productData: Omit<Product, "id">) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        setAppState({
          ...appState,
          products: products.map(product =>
            product.id === id
              ? { ...productData, barcode: productData.barcode?.trim() || undefined, id }
              : product
          ),
        });
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAppState({
          ...appState,
          products: products.filter(product => product.id !== id),
          cart: cart.filter(item => item.id !== id),
        });
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);

    const nextCart = existingItem
      ? cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { ...product, quantity: 1 }];

    setAppState({
      ...appState,
      cart: nextCart,
    });
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setAppState({
      ...appState,
      cart: cart.map(item => (item.id === id ? { ...item, quantity } : item)),
    });
  };

  const removeFromCart = (id: string) => {
    setAppState({
      ...appState,
      cart: cart.filter(item => item.id !== id),
    });
  };

  const clearCart = () => {
    setAppState({
      ...appState,
      cart: [],
    });
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        shopDetails,
        updateShopDetails,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
