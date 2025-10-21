import React, { useEffect } from "react";
import { createContext, type ReactNode } from "react";
import { useState } from "react";
import type Customer from "~/client/types/customer";

type AuthContextType = {
  customer: Customer | null;
  setCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
};

export const AuthContext = createContext<AuthContextType>({
  customer: null,
  setCustomer: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  useEffect(() => {
    const data: Customer = JSON.parse(localStorage.getItem("customer") || "{}");
    if (!(!!data || Object.keys(data).length === 0 || Object.keys(data).length === 0)) {
      setCustomer(data);
    }
  }, []);
  return <AuthContext.Provider value={{ customer, setCustomer }}>{children}</AuthContext.Provider>;
};
