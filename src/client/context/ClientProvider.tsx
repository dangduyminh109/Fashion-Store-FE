import { type ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import store from "~/client/store";
import theme from "../theme";
import { AuthFormProvider } from "./AuthFormContext";
import { BackDrop } from "./BackDrop";
import { GlobalStyle } from "~/admin/components/GlobalStyles";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
const ClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnHover={false}
      />
      <AuthProvider>
        <CartProvider>
          <BackDrop>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <GlobalStyle />
              <AuthFormProvider>{children}</AuthFormProvider>
            </ThemeProvider>
          </BackDrop>
        </CartProvider>
      </AuthProvider>
    </Provider>
  );
};

export default ClientProvider;
