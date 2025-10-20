import { useRef, useState } from "react";
import { Button, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import defaultImg from "~/assets/images/default-image.png";

export const LeftBlock = ({ productImages }: { productImages: string[] | undefined }) => {
  const theme = useTheme();
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const images = productImages && productImages.length ? productImages : [defaultImg];

  return (
    <Box sx={{ display: "flex", gap: "20px" }}>
      <Box sx={{ width: "15%" }}>
        {images.map((productImg, index) => (
          <Button
            key={index}
            onClick={() => {
              if (swiperRef.current) {
                if (
                  swiperRef.current.loopedSlides !== undefined ||
                  swiperRef.current.params?.loop
                ) {
                  swiperRef.current.slideToLoop(index);
                } else {
                  swiperRef.current.slideTo(index);
                }
              }
              setActiveIndex(index);
            }}
            sx={{
              overflow: "hidden",
              mb: "10px",
              p: 0,
              cursor: "pointer",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: `2px solid ${
                activeIndex === index ? theme.palette.primary.main : "transparent"
              }`,
              transition: "border-color .2s",
              "& img": {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: ".5s",
              },
              "&:hover img": {
                transform: "scale(1.05)",
              },
            }}
          >
            <img src={productImg || defaultImg} alt={`thumb-${index}`} />
          </Button>
        ))}
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          "& .product-image": {
            width: "100%",
          },
          "& .swiper-button-next, & .swiper-button-prev": {
            color: "primary.main",
            transition: "ease 0.3s",
            padding: 1,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9) ",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              color: "secondary.main",
            },
          },
          "& .swiper-pagination-bullet": {
            bgcolor: "primary.main",
          },
        }}
      >
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="product-image"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setActiveIndex(swiper.realIndex ?? 0);
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex ?? swiper.activeIndex ?? 0);
          }}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img} alt={`product-${index}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};
