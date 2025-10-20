import { Box, Typography, Button } from "@mui/material";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export const Carousel = () => {
  useLayoutEffect(() => {
    const header = document.querySelector("#header") as HTMLElement | null;
    ScrollTrigger.create({
      trigger: "#header",
      start: "top -20%",
      onEnter: () => header?.classList.add("active"),
      onLeaveBack: () => header?.classList.remove("active"),
    });
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "#carousel",
        {
          y: -100,
          opacity: 0.3,
        },
        {
          y: 0,
          duration: 1.5,
          opacity: 1,
          ease: "power3.out",
        }
      );

      const tl = gsap.timeline({ defaults: { ease: "power2.in", duration: 0.8 } });
      tl.from("#carousel-title", { y: 70, opacity: 0 })
        .from("#carousel-slogan", { y: 60, opacity: 0 }, "-=0.5")
        .from("#carousel-content", { y: 50, opacity: 0 }, "-=0.5")
        .from("#carousel-btn", { y: 40, opacity: 0 }, "-=0.5");
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <Box
      component={"section"}
      sx={{
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          height: "100%",
          bottom: 0,
          left: 0,
          width: "80%",
          background: "linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))",
        }}
      ></Box>
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          transform: "translateY(-50%)",
          left: "10%",
          width: {
            sm: "40%",
            xs: "60%",
          },
        }}
      >
        <Typography
          variant="body1"
          color={"secondary.main"}
          id="carousel-title"
          sx={{ fontSize: "2rem" }}
        >
          Đón đầu xu hướng thời trang
        </Typography>
        <Typography
          variant="h1"
          color="text.secondary"
          sx={{
            fontSize: {
              lg: "7rem",
              md: "5rem",
              xs: "3rem",
            },
            textTransform: "capitalize",
          }}
          id="carousel-slogan"
        >
          Cái nhìn đẹp nhất mọi lúc mọi nơi
        </Typography>
        <Typography variant="body1" color="text.secondary" id="carousel-content">
          Làm mới phong cách của bạn với những món đồ hợp xu hướng từ bộ sưu tập quần áo. Bất cứ ai
          cũng có thể ăn mặc và quyến rũ.
        </Typography>
        <Button
          variant="outlined"
          id="carousel-btn"
          color="secondary"
          sx={{
            mt: "10px",
            "&:hover": {
              bgcolor: "secondary.main",
              color: "text.secondary",
            },
          }}
          startIcon={<ArrowForwardIcon />}
        >
          khám phá ngay
        </Button>
      </Box>
    </Box>
  );
};
