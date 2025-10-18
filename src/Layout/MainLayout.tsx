import { Outlet } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useLayoutEffect, useRef } from "react";
import Siderbar from "~/client/components/Sidebar";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const MainLayout = () => {
  const shiftPressedRef = useRef(false);
  const hoverRef = useRef(false);
  const smootherRef = useRef<ScrollSmoother | null>(null);

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

    const nativeScrollEls = document.querySelectorAll(".native-scroll");

    nativeScrollEls.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        hoverRef.current = true;
        if (shiftPressedRef.current) {
          smootherRef.current?.paused(true);
        }
      });
      el.addEventListener("mouseleave", () => {
        hoverRef.current = false;
        smootherRef.current?.paused(false);
      });
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

  return (
    <div id="smooth-wrapper">
      <Siderbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
