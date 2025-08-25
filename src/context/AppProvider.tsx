import { type ReactNode } from "react";

import { SidebarProvider } from "./SidebarContext";
import ThemeModeProvider from "./ThemeContext";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeModeProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeModeProvider>
  );
};

export default AppProvider;
