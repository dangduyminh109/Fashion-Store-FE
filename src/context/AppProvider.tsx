import type { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";

import { SidebarProvider } from "./SidebarContext";
import theme from "~/theme";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
