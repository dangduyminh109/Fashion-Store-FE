import { Box } from "@mui/material";
import carousel from "~/assets/images/carousel-1.png";
import { Carousel } from "./components/Carousel";
import { Category } from "./components/Category";
import { Offer } from "./components/Offer";
import { Blog } from "./components/Blog";
import { NewProduct } from "./components/NewProduct";
import { FeaturedProduct } from "./components/FeaturedProduct";

function Home() {
  return (
    <Box sx={{ mt: "-45px" }}>
      <Box
        id="carousel"
        sx={{
          width: "100%",
          height: "100vh",
          backgroundImage: `url(${carousel})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "fixed",
          zIndex: -10,
        }}
      ></Box>
      <Carousel />
      <Category />
      <Offer />
      <NewProduct />
      <FeaturedProduct />
      <Blog />
    </Box>
  );
}

export default Home;
