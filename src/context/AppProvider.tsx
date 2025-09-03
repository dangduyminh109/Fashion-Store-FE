import { type ReactNode } from "react";

import { SidebarProvider } from "./SidebarContext";
import ThemeModeProvider from "./ThemeContext";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "~/store";
const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeModeProvider>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          rtl={false}
          pauseOnHover={false}
        />
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeModeProvider>
    </Provider>
  );
};

export default AppProvider;
