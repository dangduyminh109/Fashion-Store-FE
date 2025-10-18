import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import logo from "~/assets/images/Logo/logo-white.png";
import { CategoryList } from "../CategoryList";
import type { AppDispatch, RootState } from "~/client/store";
import { fetchSidebar } from "~/client/features/sidebar/sidebarApi";
import { SubCategory } from "../CategoryList/SubCategory";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const { categoryData, isSubCategory, currentCategory, isOpen } = useSelector(
    (state: RootState) => state.navbar
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (categoryData?.length === 0) {
      dispatch(
        fetchSidebar({
          url: "/category/getTree",
          method: "get",
        })
      );
    }
  }, []);

  function ToggleDrawer() {
    dispatch({ type: "sidebar/toggle" });
  }

  function handlePrevCategory() {
    dispatch({ type: "sidebar/prevCurrentCategory", payload: currentCategory });
  }

  const SidebarList = (
    <Box sx={{ width: 250, color: "text.secondary" }} role="presentation">
      <Box
        className="header-logo"
        sx={{
          width: "100%",
          height: "50px",
          py: "5px",
          textAlign: "center",
          bgcolor: "secondary.main",
          "& img": {
            objectFit: "contain",
            height: "100%",
            padding: "3px 5px",
            transition: "0.3s ease",
            borderRadius: "5px",
          },
          "&.active img": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <Link to={"/"}>
          <img src={logo} alt="logo" />
        </Link>
      </Box>
      <List>
        {!isSubCategory && (
          <Fragment>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "0", mr: "5px" }}>
                  <InventoryIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={"Sản Phẩm"} />
              </ListItemButton>
            </ListItem>

            <ListItemButton onClick={handleClick}>
              <ListItemIcon sx={{ minWidth: "0", mr: "5px" }}>
                <CategoryIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary="Danh Mục" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <CategoryList isOpen={open} />

            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "0", mr: "5px" }}>
                  <LoyaltyIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={"Khuyến Mãi"} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "0", mr: "5px" }}>
                  <ArticleIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={"Bài Viết"} />
              </ListItemButton>
            </ListItem>
          </Fragment>
        )}

        {isSubCategory && (
          <Fragment>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handlePrevCategory()}>
                <ListItemIcon sx={{ minWidth: "0", mr: "5px" }}>
                  <ArrowBackIosIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={currentCategory?.name} />
              </ListItemButton>
            </ListItem>
            <SubCategory data={currentCategory} />
          </Fragment>
        )}
      </List>
    </Box>
  );

  return (
    <Drawer open={isOpen} onClose={ToggleDrawer}>
      {SidebarList}
    </Drawer>
  );
}
