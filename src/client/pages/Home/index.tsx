import { Box } from "@mui/material";
import { Carousel } from "./components/Carousel";
import { Category } from "./components/Category";
import { Offer } from "./components/Offer";
import { Post } from "./components/Post";
import { NewProduct } from "./components/NewProduct";
import { FeaturedProduct } from "./components/FeaturedProduct";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "~/client/context/AuthContext";
import { toast } from "react-toastify";
import axiosClient from "~/client/hooks/useFetch";
import BreadcrumbContext from "~/client/context/BreadcrumbContext";

function Home() {
  const location = useLocation();
  const { setCustomer } = useContext(AuthContext);

  const { setBreadcrumb } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumb([]);
  }, []);

  useEffect(() => {
    async function handleSubmit() {
      try {
        const customer = (await axiosClient.get("/customer/me")).data;
        if (customer && customer.code === 1000) {
          localStorage.setItem("customer", JSON.stringify(customer.result));
          setCustomer(customer.result);
          toast.success("Đăng nhập thành công!");
        }
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
    <Box sx={{ mt: "-45px" }} id="smooth-content">
      <Carousel />
      <Category />
      <Offer />
      <NewProduct />
      <FeaturedProduct />
      <Post />
    </Box>
  );
}

export default Home;
