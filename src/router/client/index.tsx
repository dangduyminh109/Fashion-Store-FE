import { lazy } from "react";
import ClientProvider from "~/client/context/ClientProvider";

import MainLayout from "~/Layout/MainLayout";
const Home = lazy(() => import("~/client/pages/Home"));
const Detail = lazy(() => import("~/client/pages/Detail"));
const Cart = lazy(() => import("~/client/pages/Cart"));

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
        path: ":slug",
        element: <Detail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
];
export default ClientRoutes;
