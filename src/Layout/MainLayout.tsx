import { Outlet, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";

import Header from "~/components/Header";
import Sidebar from "~/components/Sidebar";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const MainLayout = () => {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname;

      const msg = location.state?.message;
      if (msg) {
        toast.success(msg);
      }
    }
  }, [location]);

  return (
    <Box sx={{ height: " 100vh", display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflowX: "hidden" }}>
        <Header />
        <Box
          component={"main"}
          sx={{
            p: "20px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
