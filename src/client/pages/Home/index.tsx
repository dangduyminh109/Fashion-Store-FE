import { Box } from "@mui/material";
import carousel from "~/assets/images/carousel-1.png";
import { Carousel } from "./components/Carousel";
import { Category } from "./components/Category";
import { Offer } from "./components/Offer";
import { Blog } from "./components/Blog";
import { Footer } from "~/client/components/Footer";
import { Header } from "~/client/components/Header";
function Home() {
  return (
    <>
      <Header />
      <Box
        id="carousel"
        sx={{
          mt: "-45px",
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
      <Box id="smooth-content" component={"main"} sx={{ mt: "-45px" }}>
        <Carousel />
        <Category />
        <Offer />
        <Blog />
        <Footer />
      </Box>
    </>
  );
}

export default Home;
