import { lazy } from "react";
import ClientProvider from "~/client/context/ClientProvider";

import MainLayout from "~/Layout/MainLayout";
const Home = lazy(() => import("~/client/pages/Home"));

const ClientRoutes = [
  {
    element: (
      <ClientProvider>
        <MainLayout />
      </ClientProvider>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
];
export default ClientRoutes;
