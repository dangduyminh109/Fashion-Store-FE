import "swiper/swiper-bundle.css";
import { Outlet } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import Box from "@mui/material/Box";

import Siderbar from "~/client/components/Sidebar";
import { Header } from "~/client/components/Header";
import { HeaderCategoryList } from "~/client/components/Header/HeaderCategoryList";
import { Footer } from "~/client/components/Footer";
import { AuthForm } from "~/client/components/AuthForm";
import axiosClient from "~/client/hooks/useFetch";
import { AuthContext } from "~/client/context/AuthContext";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const MainLayout = () => {
  const shiftPressedRef = useRef(false);
  const hoverRef = useRef(false);
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const { setCustomer } = useContext(AuthContext);
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (smootherRef.current) return;

    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
      effects: true,
      normalizeScroll: true,
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        shiftPressedRef.current = true;
        if (hoverRef.current) {
          smootherRef.current?.paused(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        shiftPressedRef.current = false;
        smootherRef.current?.paused(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const nativeScrollMain = document.querySelector("main");
    nativeScrollMain?.addEventListener("mouseenter", () => {
      hoverRef.current = true;
      if (shiftPressedRef.current) {
        smootherRef.current?.paused(true);
      }
    });
    nativeScrollMain?.addEventListener("mouseleave", () => {
      hoverRef.current = false;
      smootherRef.current?.paused(false);
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (smootherRef.current) {
        smootherRef.current.kill();
        smootherRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    async function getProfile() {
      try {
        const data = (await axiosClient.get("/customer/me")).data;
        localStorage.setItem("customer", JSON.stringify(data.result));
        setCustomer(data.result);
      } catch (error: any) {
        localStorage.removeItem("customer-token");
        console.log("Get profile error!!!");
      }
    }
    const token = localStorage.getItem("customer-token");
    if (token) {
      localStorage.setItem("customer-token", token);
      getProfile();
    }
  }, []);

  return (
    <Box id="smooth-wrapper">
      <Header />
      <HeaderCategoryList />
      <Siderbar />
      <AuthForm />
      <Box id="smooth-content" component={"main"}>
        <Outlet />
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;
