import { createBrowserRouter } from "react-router-dom";

import AdminRoutes from "./admin";
import ClientRoutes from "./client";

export default createBrowserRouter([
  {
    path: "/admin/*",
    children: AdminRoutes,
  },
  {
    path: "/*",
    children: ClientRoutes,
  },
]);
