import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "~/Layout/MainLayout";
import { Login } from "~/pages/Auth/Login";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

const Dashboard = lazy(() => import("~/pages/Dashboard"));
const Product = lazy(() => import("~/pages/Product"));
const Category = lazy(() => import("~/pages/Category"));
const CreateCategory = lazy(() => import("~/pages/Category/create"));
const EditCategory = lazy(() => import("~/pages/Category/edit"));

export default createBrowserRouter([
  {
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
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
      {
        path: "/category/create",
        element: <CreateCategory />,
      },
      {
        path: "/category/edit/:id",
        element: <EditCategory />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
]);
