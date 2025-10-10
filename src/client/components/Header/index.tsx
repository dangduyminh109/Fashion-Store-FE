import gsap from "gsap";
import Box from "@mui/material/Box";
import { useLayoutEffect, useRef } from "react";
import Container from "@mui/material/Container";
import logo from "~/assets/images/logo-white.png";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Badge, { type BadgeProps } from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  "& .MuiBadge-badge": {
    right: 0,
    top: 5,
    padding: "0 2px",
  },
}));
export const Header = () => {
  const headerRef = useRef(null);
  useLayoutEffect(() => {
    const logo = document.querySelector(".header-left") as HTMLElement | null;
    ScrollTrigger.create({
      trigger: "#category",
      start: "top 20%",
      onEnter: () => logo?.classList.add("active"),
      onLeaveBack: () => logo?.classList.remove("active"),
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
        zIndex: 1000,
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
          className="header-effect header-left"
          sx={{
            height: "100%",
            width: "20%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "3px",
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
          <IconButton
            aria-label="menu"
            sx={{
              display: {
                xs: "inline-block",
                sm: "none",
              },
            }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          <IconButton aria-label="cart">
            <SearchIcon fontSize="large" />
          </IconButton>
        </Box>
        <Box
          ref={headerRef}
          component={"nav"}
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
            padding: "10 5px",
            alignItems: "center",
            height: "100%",
            width: "100%",
            maxWidth: "500px",
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
            <Box component={"li"}>
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
            <StyledBadge badgeContent={4} color="secondary">
              <ShoppingCartIcon fontSize="large" />
            </StyledBadge>
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
};
