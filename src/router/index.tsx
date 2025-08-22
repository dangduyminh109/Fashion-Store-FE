import { createBrowserRouter } from "react-router-dom";
import MainLayout from "~/Layout/MainLayout";
import Home from "~/pages/Home";
import Detail from "~/pages/Detail";

export default createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/detail",
        element: <Detail />,
      },
    ],
  },
]);
