import { memo, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import HeaderLeft from "./HeaderLeft";
import SidebarContext from "~/context/SidebarContext";

const Header = () => {
  const { isShow, OpenSidebar, CloseSidebar } = useContext(SidebarContext);
  return (
    <Box
      component={"header"}
      sx={{
        display: "flex",
        alignItems: "center",
        height: "70px",
        position: "sticky",
        padding: "10px",
        justifyContent: "space-between",
        top: 0,
        left: 0,
        zIndex: 100,
        bgcolor: "background.default",
        borderBottom: `1px solid #ccc`,
      }}
    >
      {!isShow ? (
        <IconButton onClick={OpenSidebar}>
          <MenuIcon fontSize="large" />
        </IconButton>
      ) : (
        <IconButton onClick={CloseSidebar}>
          <MenuOpenIcon fontSize="large" />
        </IconButton>
      )}
      <HeaderLeft />
    </Box>
  );
};

export default memo(Header);
