import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

import defaultImg from "~/assets/images/default-image.png";

interface Props {
  images: string[];
}

export const CartItem = (props: Props) => {
  return (
    <Box
      sx={{
        padding: "10px",
        position: "static",
        display: "block",
        backgroundColor: "#fff",
        border: "none",
        borderRadius: "0px",
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          width: "100%",
          aspectRatio: "1 / 1.5",
          "& a": {
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "ease-in-out 0.3s",
          },
          "&:hover": {
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          },
          "&:hover a": {
            transform: "scale(1.05, 1.05)",
          },
          "& img": {
            maxWidth: "100%",
            Height: "100%",
            objectFit: "contain",
            transform: "scale(1.05, 1.05)",
          },
          "& img:last-child": {
            display: "none",
          },
          "&:hover img:last-child": {
            display: "block",
          },
          "&:hover img:first-of-type": {
            display: "none",
          },
        }}
      >
        <Link to={"/"}>
          <img src={props.images[0] || defaultImg} alt="sản phẩm" />
          <img src={props.images[1] || props.images[0] || defaultImg} alt="sản phẩm" />
        </Link>
      </Box>

      <Box p={"10px 0"}>
        <Box
          sx={{
            display: "flex",
            gap: "5px",
            mt: "5px",
            height: "35px",
          }}
        >
          {props.images.length > 0 &&
            props.images.map((img, index) => (
              <Box
                className="card-desc__option active"
                key={index}
                sx={{
                  width: "35px",
                  cursor: "pointer",
                  transition: "0.3s",
                  "&.active": {
                    border: "1px solid #000",
                  },
                  "&.white": {
                    backgroundColor: "#fff",
                    width: "33px",
                    height: "33px",
                  },
                  "&:hover": {
                    transform: "scale(1.1, 1.1)",
                  },
                  "& img": {
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  },
                }}
              >
                <img src={img} />
              </Box>
            ))}
        </Box>
        <Box
          component={"p"}
          sx={{
            fontSize: "1.4rem",
            color: "text.primary",
            mt: "5px",
          }}
        >
          EGA BIKE
        </Box>
        <Typography component={"h4"} fontSize={"1.8rem"} fontWeight={600}>
          <Link to={"/"}> Xe đạp đường trường Allez 2021</Link>
        </Typography>
        <Box component={"p"} mt={"5px"}>
          <Box component={"span"} sx={{ textDecoration: "line-through" }}>
            24,580,000đ
          </Box>
          <Box
            component={"span"}
            sx={{
              bgcolor: "secondary.main",
              color: "text.secondary",
              ml: "5px",
              padding: "2px 5px",
              borderRadius: "999px",
            }}
          >
            -35%
          </Box>
        </Box>
        <Box component={"strong"} color={"secondary.main"} fontWeight={600} fontSize={"1.8rem"}>
          15,990,000đ
        </Box>
        <Box
          component={"p"}
          sx={{
            mt: "10px",
            fontWeight: 500,
          }}
        >
          Đã bán 177 sản phẩm
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "5px",
            backgroundColor: "text.primary",
            borderRadius: "999px",
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              height: "100%",
              top: 0,
              left: 0,
              position: "absolute",
              borderRadius: "999px",
              backgroundColor: "secondary.main",
              width: "40%",
            },
          }}
          className="card-desc__sold-1"
        ></Box>
      </Box>
    </Box>
  );
};
