import { Box } from "@mui/material";
import carousel from "~/assets/images/carousel-1.png";
import { Carousel } from "./components/Carousel";
import { Category } from "./components/Category";
import { Offer } from "./components/Offer";
import { Blog } from "./components/Blog";
import { NewProduct } from "./components/NewProduct";
import { FeaturedProduct } from "./components/FeaturedProduct";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "~/client/context/AuthContext";
import { toast } from "react-toastify";
import axiosClient from "~/client/hooks/useFetch";

function Home() {
  const location = useLocation();
  const { setCustomer } = useContext(AuthContext);

  useEffect(() => {
    async function handleSubmit() {
      try {
        const data = (await axiosClient.get("/customer/me")).data;
        localStorage.setItem("customer", JSON.stringify(data.result));
        setCustomer(data.result);
        toast.success("Đăng nhập thành công!");
      } catch (error: any) {
        let message = "Đăng nhập không thành công có lỗi xãy ra!!!";
        toast.error(message);
      }
    }
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    if (token) {
      localStorage.setItem("customer-token", token);
      handleSubmit();
    }
  }, []);

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
