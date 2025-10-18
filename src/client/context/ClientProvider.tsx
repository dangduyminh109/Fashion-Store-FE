import { type ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import { GlobalStyle } from "~/admin/components/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";

import store from "~/client/store";
import theme from "../theme";

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </Provider>
  );
};

export default ClientProvider;
