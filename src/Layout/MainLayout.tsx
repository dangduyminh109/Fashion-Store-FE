import { Outlet } from "react-router-dom";
import Header from "~/components/Header";
import NavBar from "~/components/NavBar";
import { Box, Grid } from "@mui/material";

function MainLayout() {
  return (
    <Box sx={{ height: " 100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Grid container sx={{ flex: "1" }}>
        <Grid size={3}>
          <NavBar />
        </Grid>
        <Grid size={9}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainLayout;
