import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "~/Layout/MainLayout";
import { Login } from "~/pages/Auth/Login";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

const Dashboard = lazy(() => import("~/pages/Dashboard"));
const Product = lazy(() => import("~/pages/Product"));
const CreateProduct = lazy(() => import("~/pages/Product/create"));
const EditProduct = lazy(() => import("~/pages/Product/edit"));

const Attribute = lazy(() => import("~/pages/Attribute"));
const CreateAttribute = lazy(() => import("~/pages/Attribute/create"));
const EditAttribute = lazy(() => import("~/pages/Attribute/edit"));

const Category = lazy(() => import("~/pages/Category"));
const CreateCategory = lazy(() => import("~/pages/Category/create"));
const EditCategory = lazy(() => import("~/pages/Category/edit"));

const ImportReceipt = lazy(() => import("~/pages/ImportReceipt"));
const CreateImportReceipt = lazy(() => import("~/pages/ImportReceipt/create"));
const EditImportReceipt = lazy(() => import("~/pages/ImportReceipt/edit"));

const Brand = lazy(() => import("~/pages/Brand"));
const CreateBrand = lazy(() => import("~/pages/Brand/create"));
const EditBrand = lazy(() => import("~/pages/Brand/edit"));

const Supplier = lazy(() => import("~/pages/Supplier"));
const CreateSupplier = lazy(() => import("~/pages/Supplier/create"));
const EditSupplier = lazy(() => import("~/pages/Supplier/edit"));

const Role = lazy(() => import("~/pages/Role"));
const CreateRole = lazy(() => import("~/pages/Role/create"));
const EditRole = lazy(() => import("~/pages/Role/edit"));

const Permission = lazy(() => import("~/pages/Permission"));

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
        path: "/product/create",
        element: <CreateProduct />,
      },
      {
        path: "/product/edit/:id",
        element: <EditProduct />,
      },

      {
        path: "/product/attributes",
        element: <Attribute />,
      },
      {
        path: "/attribute/create",
        element: <CreateAttribute />,
      },
      {
        path: "/attribute/edit/:id",
        element: <EditAttribute />,
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

      {
        path: "/product/import-receipts",
        element: <ImportReceipt />,
      },
      {
        path: "/import-receipt/create",
        element: <CreateImportReceipt />,
      },
      {
        path: "/import-receipt/edit/:id",
        element: <EditImportReceipt />,
      },

      {
        path: "/user/roles",
        element: <Role />,
      },
      {
        path: "/role/create",
        element: <CreateRole />,
      },
      {
        path: "/role/edit/:id",
        element: <EditRole />,
      },

      {
        path: "/user/permissions",
        element: <Permission />,
      },

      {
        path: "/brands",
        element: <Brand />,
      },
      {
        path: "/brand/create",
        element: <CreateBrand />,
      },
      {
        path: "/brand/edit/:id",
        element: <EditBrand />,
      },
      {
        path: "/suppliers",
        element: <Supplier />,
      },
      {
        path: "/supplier/create",
        element: <CreateSupplier />,
      },
      {
        path: "/supplier/edit/:id",
        element: <EditSupplier />,
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
