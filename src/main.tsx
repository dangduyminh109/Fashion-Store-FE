import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "~/assets/styles/GlobalStyle.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import router from "./router/index";
import AppProvider from "./context/AppProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <AppProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </AppProvider>
  </StrictMode>
);
