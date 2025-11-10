import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useLayoutEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import gsap from "gsap";
import { Link, useNavigate } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import defaultCategory from "~/assets/images/default-category.png";
import type CategoryFeatured from "~/client/types/categoryFeatured";
import { setCategory } from "~/client/features/product/productSlice";
import type { AppDispatch } from "~/client/store";
gsap.registerPlugin(ScrollTrigger);

export const CategoryItem = ({ data }: { data: CategoryFeatured }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#category",
        start: "top 50%",
        onEnter: () => {
          imgRef.current?.classList.add("active");
        },
      });
    });
    return () => {
      ctx.revert();
    };
  }, []);
  function handleChooseCategory(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: number) {
    e.preventDefault();
    dispatch(setCategory({ [String(id)]: true }));
    navigate(`/list-product`);
  }
  return (
    <Box sx={{ minWidth: "150px", maxWidth: "200px" }}>
      <Link to={`/list-product`} onClick={(e) => handleChooseCategory(e, data.id)}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
            overflow: "hidden",
            "& img": {
              height: "100%",
              width: "auto",
              objectFit: "cover",
              position: "absolute",
              zIndex: 10,
              transition: "0.3s",
              transform: "scale(0.6)",
            },
            "&:hover .category-item__circle": {
              transform: "scale(1.3)",
              backgroundColor: "primary.main",
              opacity: 1,
            },
            "&:hover .img1": {
              display: "none",
            },
            "& img.active": {
              transform: "scale(1.1)",
            },
          }}
        >
          <img src={data.image || defaultCategory} alt="category" ref={imgRef} />
          <Box
            className="category-item__circle"
            sx={{
              height: "100%",
              aspectRatio: "1/1",
              borderRadius: "50%",
              backgroundColor: "#ccc",
              opacity: 0.5,
              transition: "0.3s",
            }}
          ></Box>
        </Box>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontSize: "1.6rem",
            fontWeight: 600,
            marginTop: "10px",
            color: "text.secondar",
            whiteSpace: "nowrap",
          }}
        >
          {data.name}
        </Typography>
        <Box
          component={"p"}
          sx={{
            textAlign: "center",
            fontSize: "1.4rem",
            margin: "5px 0 10px",
          }}
        >
          {data.productCount} sản phẩm
        </Box>
      </Link>
    </Box>
  );
};
