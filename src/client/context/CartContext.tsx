import React, { useEffect } from "react";
import { createContext, type ReactNode } from "react";
import { useState } from "react";
import type Cart from "~/client/types/cart";

type CartContextType = {
  cart: Cart[];
  setCart: React.Dispatch<React.SetStateAction<Cart[]>>;
};

export const CartContext = createContext<CartContextType>({
  cart: [],
  setCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart[]>([]);
  useEffect(() => {
    const data: Cart[] = JSON.parse(localStorage.getItem("cart") || "[]");
    if (Array.isArray(data)) {
      setCart(data);
    }
  }, []);
  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
};
