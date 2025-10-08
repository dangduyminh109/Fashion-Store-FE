import { type ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CssBaseline from "@mui/material/CssBaseline";

import { SidebarProvider } from "./SidebarContext";
import { AuthProvider } from "./AuthContext";
import { BackDrop } from "./BackDrop";
import ThemeModeProvider from "./ThemeContext";
import store from "~/admin/store";
import { GlobalStyle } from "~/admin/components/GlobalStyles";

const AdminProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BackDrop>
          <ThemeModeProvider>
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              rtl={false}
              pauseOnHover={false}
            />
            <CssBaseline />
            <GlobalStyle />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <SidebarProvider>{children}</SidebarProvider>
            </LocalizationProvider>
          </ThemeModeProvider>
        </BackDrop>
      </AuthProvider>
    </Provider>
  );
};

export default AdminProvider;
