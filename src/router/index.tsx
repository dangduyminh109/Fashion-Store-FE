import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "~/Layout/MainLayout";

const Dashboard = lazy(() => import("~/pages/Dashboard"));
const Product = lazy(() => import("~/pages/Product"));
const Category = lazy(() => import("~/pages/Category"));

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
      {
        path: "/product/categories",
        element: <Category />,
      },
    ],
  },
]);
