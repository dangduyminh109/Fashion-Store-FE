import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Fragment, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CartItem } from "~/client/components/CartItem";
import PrimaryButton from "~/client/components/PrimaryButton";
import { useFetch } from "~/client/hooks/useFetch";
import type ProductFeatured from "~/client/types/productFeatured";

gsap.registerPlugin(ScrollTrigger);

export const FeaturedProduct = () => {
  const { data, loading, error } = useFetch<ProductFeatured[]>({
    endpoint: "/product/featured?quantity=8",
    method: "get",
  });
  useLayoutEffect(() => {
    if (!data || loading || error) return;
    const ctx = gsap.context(() => {
      gsap.from(".card-item-wrapper", {
        scrollTrigger: {
          trigger: "#NewProduct",
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
    <Fragment>
      {!error && (
        <Box
          component="section"
          id="NewProduct"
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
                mb: 2,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                Sản Phẩm Nổi Bật
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {data &&
                !loading &&
                data.map((product, index) => (
                  <Grid size={{ xs: 6, md: 4, lg: 3 }} key={index} className="card-item-wrapper">
                    <CartItem key={product.id} data={product} isNew={false} />
                  </Grid>
                ))}
            </Grid>
            <Box textAlign={"center"}>
              <PrimaryButton sx={{ padding: "10px 20px" }}>Xem Thêm Sản Phẩm</PrimaryButton>
            </Box>
          </Box>
        </Box>
      )}
    </Fragment>
  );
};
