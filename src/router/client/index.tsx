import { lazy } from "react";

import MainLayout from "~/Layout/MainLayout";
const Home = lazy(() => import("~/client/pages/Home"));

const ClientRoutes = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
];
export default ClientRoutes;
