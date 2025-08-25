import { useContext } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import List from "@mui/material/List";
import CheckroomIcon from "@mui/icons-material/Checkroom";

import SidebarContext from "~/context/SidebarContext";
import LogoBlack from "~/assets/images/logo-black.png";
import LogoWhite from "~/assets/images/logo-white.png";
import ListSidebarItem from "./ListSidebarItem";
import { useTheme } from "@mui/material";
import { ThemeContext } from "~/context/ThemeContext";

const Sidebar = () => {
  const theme = useTheme();
  const { isShow, CloseSidebar } = useContext(SidebarContext);
  const permanentDrawer = useMediaQuery(theme.breakpoints.up("md"));
  const width = isShow ? "250px" : "60px";
  const { mode } = useContext(ThemeContext);
  return (
    <Drawer
      open={isShow}
      anchor="left"
      variant={permanentDrawer ? "permanent" : "temporary"}
      onClose={permanentDrawer ? undefined : CloseSidebar}
      sx={{
        width,
        "& .MuiDrawer-paper": {
          bgcolor: "secondary.main",
          width,
          boxSizing: "border-box",
          transition: "0.3s",
          border: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "70px",
          p: "10px",
        }}
      >
        {isShow ? (
          <>
            <Link to="/">
              <img
                src={mode ? LogoWhite : LogoBlack}
                style={{ maxHeight: "45px", objectFit: "contain" }}
                alt="logo"
              />
            </Link>
          </>
        ) : (
          <Link to="/">
            <CheckroomIcon fontSize="large" sx={{ transform: "scaleX(-1)" }} />
          </Link>
        )}
      </Box>

      <List component={"nav"} aria-labelledby="nested-list-subheader" sx={{ padding: 0 }}>
        <ListSidebarItem isShow={isShow} />
      </List>
    </Drawer>
  );
};

export default Sidebar;
