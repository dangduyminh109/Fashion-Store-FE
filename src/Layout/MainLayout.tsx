import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

import Header from "~/components/Header";
import Sidebar from "~/components/Sidebar";

const MainLayout = () => {
  return (
    <Box sx={{ height: " 100vh", display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Header />
        <Box component={"main"} sx={{ p: "10px" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
