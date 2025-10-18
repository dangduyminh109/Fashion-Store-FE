import gsap from "gsap";
import Box from "@mui/material/Box";
import { useLayoutEffect, useRef } from "react";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Badge, { type BadgeProps } from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDispatch } from "react-redux";

import logo from "~/assets/images/Logo/logo-white.png";
const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  "& .MuiBadge-badge": {
    right: 0,
    top: 5,
    padding: "0 2px",
  },
}));
export const Header = () => {
  const headerRef = useRef(null);
  const categoryRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();
  function ToggleDrawer() {
    dispatch({ type: "sidebar/toggle" });
  }

  useLayoutEffect(() => {
    const logos = document.querySelectorAll<HTMLElement>(".header-logo");
    ScrollTrigger.create({
      trigger: "#category",
      start: "top 80%",
      onEnter: () => logos.forEach((logo) => logo.classList.add("active")),
      onLeaveBack: () => logos.forEach((logo) => logo.classList.remove("active")),
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
        p: "0 10px",
        top: 0,
        left: 0,
        zIndex: 110,
        pb: "5px",
        background: "transparent",
        transition: "0.5s ease",
        "&.active": {
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(0.5px)",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          gap: "10px",
          justifyContent: {
            xs: "space-between",
            md: "space-around",
          },
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
            },
            "&.active img": {
              backgroundColor: "rgba(0, 0, 0, 0.3)",
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
          <IconButton aria-label="cart">
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
              <Link to="/">Sản phẩm</Link>
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
          <IconButton aria-label="cart">
            <PersonIcon fontSize="large" />
          </IconButton>
          <IconButton aria-label="cart">
            <StyledBadge
              badgeContent={4}
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
