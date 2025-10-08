import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

const MainLayout = () => {
  return (
    <Box sx={{ height: " 100vh", display: "flex" }}>
      <Outlet />
    </Box>
  );
};

export default MainLayout;
