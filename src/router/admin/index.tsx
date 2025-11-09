import { lazy } from "react";

import AdminLayout from "~/Layout/AdminLayout";
import { Login } from "~/admin/pages/Auth/Login";
import AppProvider from "~/admin/context/AdminProvider";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import Profile from "~/admin/pages/Profile";

const Dashboard = lazy(() => import("~/admin/pages/Dashboard"));
const Product = lazy(() => import("~/admin/pages/Product"));
const CreateProduct = lazy(() => import("~/admin/pages/Product/create"));
const EditProduct = lazy(() => import("~/admin/pages/Product/edit"));

const Attribute = lazy(() => import("~/admin/pages/Attribute"));
const CreateAttribute = lazy(() => import("~/admin/pages/Attribute/create"));
const EditAttribute = lazy(() => import("~/admin/pages/Attribute/edit"));

const Category = lazy(() => import("~/admin/pages/Category"));
const CreateCategory = lazy(() => import("~/admin/pages/Category/create"));
const EditCategory = lazy(() => import("~/admin/pages/Category/edit"));

const ImportReceipt = lazy(() => import("~/admin/pages/ImportReceipt"));
const CreateImportReceipt = lazy(() => import("~/admin/pages/ImportReceipt/create"));
const EditImportReceipt = lazy(() => import("~/admin/pages/ImportReceipt/edit"));

const Brand = lazy(() => import("~/admin/pages/Brand"));
const CreateBrand = lazy(() => import("~/admin/pages/Brand/create"));
const EditBrand = lazy(() => import("~/admin/pages/Brand/edit"));

const Supplier = lazy(() => import("~/admin/pages/Supplier"));
const CreateSupplier = lazy(() => import("~/admin/pages/Supplier/create"));
const EditSupplier = lazy(() => import("~/admin/pages/Supplier/edit"));

const User = lazy(() => import("~/admin/pages/User"));
const CreateUser = lazy(() => import("~/admin/pages/User/create"));
const EditUser = lazy(() => import("~/admin/pages/User/edit"));

const Role = lazy(() => import("~/admin/pages/Role"));
const CreateRole = lazy(() => import("~/admin/pages/Role/create"));
const EditRole = lazy(() => import("~/admin/pages/Role/edit"));

const Permission = lazy(() => import("~/admin/pages/Permission"));

const Voucher = lazy(() => import("~/admin/pages/Voucher"));
const CreateVoucher = lazy(() => import("~/admin/pages/Voucher/create"));
const EditVoucher = lazy(() => import("~/admin/pages/Voucher/edit"));

const Customer = lazy(() => import("~/admin/pages/Customer"));
const CreateCustomer = lazy(() => import("~/admin/pages/Customer/create"));
const EditCustomer = lazy(() => import("~/admin/pages/Customer/edit"));

const Topic = lazy(() => import("~/admin/pages/Topic"));
const CreateTopic = lazy(() => import("~/admin/pages/Topic/create"));
const EditTopic = lazy(() => import("~/admin/pages/Topic/edit"));

const Post = lazy(() => import("~/admin/pages/Post"));
const CreatePost = lazy(() => import("~/admin/pages/Post/create"));
const EditPost = lazy(() => import("~/admin/pages/Post/edit"));

const Order = lazy(() => import("~/admin/pages/Order"));
const CreateOrder = lazy(() => import("~/admin/pages/Order/create"));
const EditOrder = lazy(() => import("~/admin/pages/Order/edit"));

const AdminRoutes = [
  {
    element: (
      <PrivateRoute>
        <AppProvider>
          <AdminLayout />
        </AppProvider>
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "products",
        element: <Product />,
      },
      {
        path: "product/create",
        element: <CreateProduct />,
      },
      {
        path: "product/edit/:id",
        element: <EditProduct />,
      },

      {
        path: "product/attributes",
        element: <Attribute />,
      },
      {
        path: "attribute/create",
        element: <CreateAttribute />,
      },
      {
        path: "attribute/edit/:id",
        element: <EditAttribute />,
      },

      {
        path: "product/categories",
        element: <Category />,
      },
      {
        path: "category/create",
        element: <CreateCategory />,
      },
      {
        path: "category/edit/:id",
        element: <EditCategory />,
      },

      {
        path: "product/import-receipts",
        element: <ImportReceipt />,
      },
      {
        path: "import-receipt/create",
        element: <CreateImportReceipt />,
      },
      {
        path: "import-receipt/edit/:id",
        element: <EditImportReceipt />,
      },

      {
        path: "users",
        element: <User />,
      },
      {
        path: "user/create",
        element: <CreateUser />,
      },
      {
        path: "user/edit/:id",
        element: <EditUser />,
      },

      {
        path: "user/roles",
        element: <Role />,
      },
      {
        path: "role/create",
        element: <CreateRole />,
      },
      {
        path: "role/edit/:id",
        element: <EditRole />,
      },

      {
        path: "user/permissions",
        element: <Permission />,
      },

      {
        path: "brands",
        element: <Brand />,
      },
      {
        path: "brand/create",
        element: <CreateBrand />,
      },
      {
        path: "brand/edit/:id",
        element: <EditBrand />,
      },

      {
        path: "suppliers",
        element: <Supplier />,
      },
      {
        path: "supplier/create",
        element: <CreateSupplier />,
      },
      {
        path: "supplier/edit/:id",
        element: <EditSupplier />,
      },

      {
        path: "vouchers",
        element: <Voucher />,
      },
      {
        path: "voucher/create",
        element: <CreateVoucher />,
      },
      {
        path: "voucher/edit/:id",
        element: <EditVoucher />,
      },

      {
        path: "customers",
        element: <Customer />,
      },
      {
        path: "customer/create",
        element: <CreateCustomer />,
      },
      {
        path: "customer/edit/:id",
        element: <EditCustomer />,
      },

      {
        path: "posts",
        element: <Post />,
      },
      {
        path: "post/create",
        element: <CreatePost />,
      },
      {
        path: "post/edit/:id",
        element: <EditPost />,
      },

      {
        path: "post/topics",
        element: <Topic />,
      },
      {
        path: "topic/create",
        element: <CreateTopic />,
      },
      {
        path: "topic/edit/:id",
        element: <EditTopic />,
      },

      {
        path: "orders",
        element: <Order />,
      },
      {
        path: "order/create",
        element: <CreateOrder />,
      },
      {
        path: "order/edit/:id",
        element: <EditOrder />,
      },
    ],
  },
  {
    path: "login",
    element: (
      <PublicRoute>
        <AppProvider>
          <Login />
        </AppProvider>
      </PublicRoute>
    ),
  },
];
export default AdminRoutes;
