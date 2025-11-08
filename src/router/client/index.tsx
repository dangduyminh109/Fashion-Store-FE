import { lazy } from "react";
import ClientProvider from "~/client/context/ClientProvider";
import ProfileLayout from "~/Layout/ProfileLayout";
import MainLayout from "~/Layout/MainLayout";
import { MyProfile } from "~/client/pages/Customer/MyProfile";
import { AddressPage } from "~/client/pages/Customer/Address";
const Home = lazy(() => import("~/client/pages/Home"));
const Detail = lazy(() => import("~/client/pages/Detail"));
const Cart = lazy(() => import("~/client/pages/Cart"));
const Checkout = lazy(() => import("~/client/pages/Checkout"));
const Product = lazy(() => import("~/client/pages/Product"));

const Success = lazy(() => import("~/client/pages/Success"));
const Error = lazy(() => import("~/client/pages/Error"));
const NotFound = lazy(() => import("~/client/pages/NotFound"));

const ClientRoutes = [
  {
    element: (
      <ClientProvider>
        <MainLayout />
      </ClientProvider>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "error",
        element: <Error />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "list-product",
        element: <Product />,
      },
      {
        path: "me",
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            element: <MyProfile />,
          },
          {
            path: "address",
            element: <AddressPage />,
          },
        ],
      },
      {
        path: "product/:slug",
        element: <Detail />,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];
export default ClientRoutes;
