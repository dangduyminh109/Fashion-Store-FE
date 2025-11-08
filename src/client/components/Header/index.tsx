import gsap from "gsap";
import Box from "@mui/material/Box";
import { Fragment, useContext, useLayoutEffect, useRef, useState } from "react";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Badge, { type BadgeProps } from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch } from "react-redux";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import { AuthContext } from "~/client/context/AuthContext";
import { Settings } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "react-toastify";

import logo from "~/assets/images/Logo/logo-white.png";
import AuthFormContext from "~/client/context/AuthFormContext";
import { CartContext } from "~/client/context/CartContext";
import SearchBox from "./SearchBox";
const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  "& .MuiBadge-badge": {
    right: 0,
    top: 5,
    padding: "0 2px",
  },
}));
export const Header = () => {
  const [openSearch, setOpenSearch] = useState(false);
  const headerRef = useRef(null);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { OpenAuthForm } = useContext(AuthFormContext);
  const { customer, setCustomer } = useContext(AuthContext);
  const dispatch = useDispatch();
  function ToggleDrawer() {
    dispatch({ type: "sidebar/toggle" });
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { cart, setCart } = useContext(CartContext);
  function handleLogout() {
    localStorage.removeItem("customer-token");
    localStorage.removeItem("customer");
    localStorage.setItem("cart", JSON.stringify([]));
    setCustomer(null);
    setCart([]);
    toast.success("Đăng xuất thành công!");
  }

  useLayoutEffect(() => {
    const header = document.querySelector("#header") as HTMLElement | null;
    ScrollTrigger.create({
      trigger: "#header",
      start: "top -20%",
      onEnter: () => header?.classList.add("active"),
      onLeaveBack: () => header?.classList.remove("active"),
    });

    gsap.fromTo(
      headerRef.current,
      {
        y: -100,
      },
      {
        y: 0,
        ease: "power2.inout",
        duration: 1,
      }
    );

    gsap.fromTo(
      ".header-effect",
      {
        y: 20,
      },
      {
        y: 0,
        ease: "power2.out",
        duration: 1.5,
      }
    );
  }, []);

  useLayoutEffect(() => {
    const headerCategoryList = document.getElementById("header-category");
    const categoryEl = categoryRef.current;
    if (!categoryEl || !headerCategoryList) return;

    const handleEnter = () => headerCategoryList.classList.add("active");
    const handleLeave = () => headerCategoryList.classList.remove("active");

    categoryEl.addEventListener("mouseenter", handleEnter);
    headerCategoryList.addEventListener("mouseleave", handleLeave);

    return () => {
      categoryEl.removeEventListener("mouseenter", handleEnter);
      headerCategoryList.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <Container
      component={"header"}
      id="header"
      disableGutters
      maxWidth={false}
      sx={{
        bgcolor: "transparent",
        height: "45px",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 110,
        pb: "5px",
        background: "transparent",
        transition: "0.5s ease",
        "&.active": {
          backgroundColor: "#fff",
          backdropFilter: "blur(0.5px)",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        },
      }}
    >
      <SearchBox open={openSearch} setOpen={setOpenSearch} handleSubmit={() => {}} />
      <Box
        sx={{
          width: "80%",
          mx: "auto",
          height: "100%",
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          className="header-effect header-logo"
          sx={{
            width: "20%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            pt: "5px",
            "& a": {
              height: "100%",
              display: {
                xs: "none",
                md: "block",
              },
            },
            "& img": {
              objectFit: "contain",
              height: "100%",
              padding: "3px 5px",
              transition: "0.3s ease",
              borderRadius: "5px",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          <IconButton
            aria-label="menu"
            onClick={ToggleDrawer}
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },
            }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          <Link to={"/"}>
            <img src={logo} alt="logo" />
          </Link>
          <IconButton
            aria-label="search"
            onClick={() => {
              setOpenSearch(true);
            }}
          >
            <SearchIcon fontSize="large" />
          </IconButton>
        </Box>
        <Box
          className="header-logo"
          sx={{
            height: "100%",
            pt: "5px",
            display: {
              xs: "none",
              sm: "block",
              md: "none",
            },
            "& a": {
              height: "100%",
            },
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
        <Box
          ref={headerRef}
          component={"nav"}
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            padding: "10 5px",
            alignItems: "center",
            height: "100%",
            width: "100%",
            maxWidth: {
              lg: "500px",
              xs: "400px",
            },
            clipPath: "polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)",
            borderRadius: "0 0 40px 40px",
            bgcolor: "background.paper",
          }}
        >
          <Box
            component={"ul"}
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              pb: "5px",
              "& *": {
                color: "text.secondary",
                fontSize: "1.4rem",
                textTransform: "capitalize",
                transition: "0.3s ease",
                "& :hover": {
                  color: "secondary.main",
                },
              },
            }}
          >
            <Box component={"li"}>
              <Link to="/list-product">Sản phẩm</Link>
            </Box>
            <Box component={"li"} ref={categoryRef}>
              <Link to="/">Danh mục</Link>
            </Box>
            <Box component={"li"}>
              <Link to="/">Khuyến mãi</Link>
            </Box>
            <Box component={"li"}>
              <Link to="/">Bài viết</Link>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "20%",
            height: "100%",
            display: "flex",
            padding: "5px 0",
            gap: "10px",
            justifyContent: "end",
            alignItems: "center",
          }}
          className="header-effect"
        >
          {customer ? (
            <Fragment>
              <Tooltip title="Tài khoản">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }} src={customer.avatar || ""}></Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      bgcolor: "background.default",
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.default",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/me");
                  }}
                >
                  <Avatar src={customer?.avatar || ""} /> {customer.fullName}
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Settings fontSize="medium" />
                  </ListItemIcon>
                  Cài Đặt
                </MenuItem>
                <Divider sx={{ bgcolor: "text.primary" }} />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="medium" />
                  </ListItemIcon>
                  Đăng Xuất
                </MenuItem>
              </Menu>
            </Fragment>
          ) : (
            <IconButton aria-label="cart" onClick={OpenAuthForm}>
              <PersonIcon fontSize="large" />
            </IconButton>
          )}

          <IconButton aria-label="cart" onClick={() => navigate("/cart")}>
            <StyledBadge
              badgeContent={cart.length}
              color="secondary"
              sx={{
                "& .MuiBadge-badge": {
                  color: "text.secondary",
                },
              }}
            >
              <ShoppingCartIcon fontSize="large" />
            </StyledBadge>
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
};
