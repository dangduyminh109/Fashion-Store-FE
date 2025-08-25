import { createBrowserRouter } from "react-router-dom";
import MainLayout from "~/Layout/MainLayout";
import Dashboard from "~/pages/Dashboard";
import Product from "~/pages/Product";

export default createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/products",
        element: <Product />,
      },
    ],
  },
]);
