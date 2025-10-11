import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import defaultImage from "~/assets/images/default-image.png";
import productImage from "~/assets/images/product.png";
import { CartItem } from "~/client/components/CartItem";
import { CountDown } from "./CountDown";
import PrimaryButton from "~/client/components/PrimaryButton";

gsap.registerPlugin(ScrollTrigger);

interface ProductCard {
  id: number;
  images: string[];
  name: string;
  category: string;
  price: string;
  original: string;
  discount: string;
  sold: string;
  soldClass: string;
  options?: string[];
  isOutOfStock?: boolean;
}

const products: ProductCard[] = [
  {
    id: 1,
    images: [productImage],
    name: "Xe đạp đường trường Allez 2021",
    category: "EGA BIKE",
    price: "15,990,000đ",
    original: "24,580,000đ",
    discount: "-35%",
    sold: "Đã bán 177 sản phẩm",
    soldClass: "card-desc__sold-1",
    options: [productImage, defaultImage],
  },
  {
    id: 2,
    images: [productImage],
    name: "Xe đạp đường trường Allez 2021",
    category: "EGA BIKE",
    price: "15,990,000đ",
    original: "24,580,000đ",
    discount: "-35%",
    sold: "Đã bán 177 sản phẩm",
    soldClass: "card-desc__sold-2",
    options: [],
  },
  {
    id: 3,
    images: [productImage, productImage],
    name: "Xe đạp đường trường Allez 2021",
    category: "EGA BIKE",
    price: "15,990,000đ",
    original: "24,580,000đ",
    discount: "-35%",
    sold: "Đã bán 177 sản phẩm",
    soldClass: "card-desc__sold-3",
  },
  {
    id: 4,
    images: [],
    name: "Xe đạp đường trường Allez 2021",
    category: "EGA BIKE",
    price: "15,990,000đ",
    original: "24,580,000đ",
    discount: "-35%",
    sold: "Hết hàng",
    soldClass: "card-desc__sold-4",
    isOutOfStock: true,
  },
];

export const Offer = () => {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".card-item-wrapper", {
        scrollTrigger: {
          trigger: "#offer",
          start: "top 50%",
          toggleActions: "play none none none",
          once: true,
        },
        y: 50,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, []);
  return (
    <Box
      component="section"
      id="offer"
      sx={{
        width: "100%",
        py: 5,
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: "80%",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: { xs: 2, md: 0 },
            }}
          >
            HAPPY SUMMER - Giảm đến 50%
          </Typography>
          <CountDown />
        </Box>
        <Grid container spacing={2}>
          {[...products].map((product, index) => (
            <Grid size={{ xs: 6, md: 4, lg: 3 }} key={index} className="card-item-wrapper">
              <CartItem key={product.id} {...product} />
            </Grid>
          ))}
        </Grid>
        <Box textAlign={"center"}>
          <PrimaryButton sx={{ padding: "10px 20px" }}>Xem Thêm Sản Phẩm</PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
