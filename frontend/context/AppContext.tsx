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
  localStorage.setItem("billing_products", JSON.stringify(appState.products));
  localStorage.setItem("billing_cart", JSON.stringify(appState.cart));
  localStorage.setItem("billing_shop", JSON.stringify(appState.shopDetails));
};

const hydrateStateFromStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  const storedProducts = readStoredValue<Product[]>("billing_products");
  const storedCart = readStoredValue<CartItem[]>("billing_cart");
  const storedShop = readStoredValue<ShopDetails>("billing_shop");

  appState = {
    products: storedProducts ?? defaultProducts,
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

  useEffect(() => {
    hydrateStateFromStorage();
  }, []);

  const { products, cart, shopDetails } = appSnapshot;

  const updateShopDetails = (details: ShopDetails) => {
    setAppState({ ...appState, shopDetails: details });
  };

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct = {
      ...productData,
      barcode: productData.barcode?.trim() || undefined,
      id: Date.now().toString(),
    };

    setAppState({
      ...appState,
      products: [...products, newProduct],
    });
  };

  const updateProduct = (id: string, productData: Omit<Product, "id">) => {
    setAppState({
      ...appState,
      products: products.map(product =>
        product.id === id
          ? { ...productData, barcode: productData.barcode?.trim() || undefined, id }
          : product
      ),
    });
  };

  const deleteProduct = (id: string) => {
    setAppState({
      ...appState,
      products: products.filter(product => product.id !== id),
      cart: cart.filter(item => item.id !== id),
    });
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
