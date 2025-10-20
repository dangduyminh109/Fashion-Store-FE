import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useRef } from "react";
import { Fragment } from "react/jsx-runtime";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";

import defaultImg from "~/assets/images/default-image.png";
import type ProductFeatured from "~/client/types/ProductFeatured";
import handlePrice from "~/utils/handlePrice";

export const CartItem = ({ data, isNew = false }: { data: ProductFeatured; isNew: boolean }) => {
  const navigate = useNavigate();
  const imgRef = useRef<HTMLImageElement>(null);
  const imgsecondRef = useRef<HTMLImageElement>(null);

  function handleChangeImage(img: string) {
    if (imgRef.current) {
      let oldImg = imgRef.current.src;
      imgRef.current.src = img;
      if (imgsecondRef.current && imgsecondRef.current.src == img) {
        imgsecondRef.current.src = oldImg;
      }
    }
  }

  const price = useMemo(() => handlePrice(data.variants), [data.variants]);
  const { minSalePrice, minPromotionPrice } = price;

  return (
    <Box
      sx={{
        padding: "10px",
        position: "relative",
        display: "block",
        backgroundColor: "#fff",
        border: "none",
        borderRadius: "0px",
      }}
    >
      {isNew && (
        <Box
          sx={{
            position: "absolute",
            top: "3%",
            right: "6%",
            bgcolor: "error.main",
            p: "2px 8px",
            zIndex: "100",
            color: "#fff",
            borderRadius: "999px",
          }}
        >
          New
        </Box>
      )}
      <Box
        sx={{
          overflow: "hidden",
          width: "100%",
          aspectRatio: "1 / 1.5",
          position: "relative",
          "& a": {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "ease-in-out 0.3s",
            height: "100%",
          },
          "& img": {
            maxWidth: "100%",
            objectFit: "cover",
            transform: "scale(1.05, 1.05)",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            transition: "ease-in-out 0.3s",
            ":last-child": {
              opacity: 0,
              visibility: "hidden",
            },
          },
          "&:hover": {
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            "& a": {
              transform: "scale(1.05, 1.05)",
            },
            "& img": {
              ":last-child": {
                opacity: 1,
                visibility: "visible",
              },
              ":first-of-type": {
                opacity: 0,
                visibility: "hidden",
              },
            },
          },
          "& .card-hover__btn": {
            opacity: 0,
            transform: "translateY(30%)",
            transition: "0.3s ease",
          },
          "&:hover .card-hover__btn": {
            opacity: 1,
            transform: "translateY(0)",
          },
        }}
      >
        <Link to={`/${data.slug}`}>
          <img ref={imgRef} src={data.productImages[0] || defaultImg} alt="ảnh sản phẩm" />
          <img
            ref={imgsecondRef}
            src={data.productImages[1] || data.productImages[0] || defaultImg}
            alt="ảnh sản phẩm"
          />
        </Link>
        <Box
          className="card-hover__btn"
          sx={{
            position: "absolute",
            width: "100%",
            bottom: "20px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            sx={{
              "&:hover": {
                bgcolor: "secondary.main",
              },
            }}
          >
            Giỏ hàng
          </Button>
          <IconButton
            sx={{
              color: "text.secondary",
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "secondary.main",
              },
            }}
            aria-label="view product"
            onClick={() => {
              navigate(`/${data.slug}`);
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </Box>
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
          {data.productImages.length > 0 &&
            data.productImages.map((img, index) => {
              if (index < 3) {
                return (
                  <Box
                    onClick={() => handleChangeImage(img)}
                    className="card-desc__option active"
                    key={index}
                    sx={{
                      width: "35px",
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
                );
              }
            })}
        </Box>
        <Box
          component={"p"}
          sx={{
            fontSize: "1.4rem",
            color: "text.primary",
            mt: "5px",
          }}
        >
          {data.brandName || data.categoryName}
        </Box>
        <Typography
          component={"h4"}
          sx={{
            fontSize: "1.8rem",
            fontWeight: "600",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.4,
            height: "calc(1.4em * 2)",
            "& a": {
              transition: "0.3s ease",
            },
            "&:hover a": {
              color: "secondary.main",
            },
          }}
        >
          <Link to={`/${data.slug}`}>{data.name}</Link>
        </Typography>
        <Box
          component={"p"}
          sx={{
            mt: "5px",
            lineHeight: "1rem",
            minHeight: "2rem",
          }}
        >
          {minSalePrice > minPromotionPrice && (
            <Fragment>
              <Box component={"span"} sx={{ textDecoration: "line-through" }}>
                {minSalePrice.toLocaleString("vi-VN")}đ
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
                -{100 - Math.floor((minPromotionPrice / minSalePrice) * 100)}%
              </Box>
            </Fragment>
          )}
        </Box>
        <Box component={"strong"} color={"secondary.main"} fontWeight={600} fontSize={"1.8rem"}>
          {minPromotionPrice.toLocaleString("vi-VN")}đ
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
