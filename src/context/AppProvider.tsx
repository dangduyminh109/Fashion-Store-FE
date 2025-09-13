import { type ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { SidebarProvider } from "./SidebarContext";
import { AuthProvider } from "./AuthContext";
import { BackDrop } from "./BackDrop";
import ThemeModeProvider from "./ThemeContext";
import store from "~/store";
import { GlobalStyle } from "~/components/GlobalStyles";

const AppProvider = ({ children }: { children: ReactNode }) => {
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

export default AppProvider;
