import React, { useEffect } from "react";
import { createContext, type ReactNode } from "react";
import { useState } from "react";
import type User from "~/types/user";

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const data: User = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(data);
  }, []);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
