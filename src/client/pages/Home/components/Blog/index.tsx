import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Fragment, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PrimaryButton from "~/client/components/PrimaryButton";
import { BlogItem } from "./BlogItem";
import { useFetch } from "~/client/hooks/useFetch";
import type PostFeatured from "~/client/types/postFeatured";

gsap.registerPlugin(ScrollTrigger);

export const Blog = () => {
  const { data, loading, error } = useFetch<PostFeatured[]>({
    endpoint: "/post/featured",
    method: "get",
  });

  useLayoutEffect(() => {
    if (!data || loading || error) return;
    const ctx = gsap.context(() => {
      gsap.from(".card-blog-item-wrapper", {
        scrollTrigger: {
          trigger: "#blog",
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
          id="blog"
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
                  color: "text.default",
                }}
              >
                Bài Viết
              </Typography>
              <PrimaryButton size="large" sx={{ padding: "8px 30px" }}>
                Xem Tất Cả
              </PrimaryButton>
            </Box>
            {data && !loading && (
              <Grid container spacing={2} alignItems={"stretch"}>
                {data.map((item) => {
                  return (
                    <Grid
                      size={{ xs: 6, md: 4, lg: 3 }}
                      className="card-blog-item-wrapper"
                      key={item.id}
                    >
                      <BlogItem data={item} />
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        </Box>
      )}
    </Fragment>
  );
};
