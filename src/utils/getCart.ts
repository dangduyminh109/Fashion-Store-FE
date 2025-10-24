import axiosClient from "~/client/hooks/useFetch";
import type Cart from "~/client/types/cart";

async function getCart(setCart: React.Dispatch<React.SetStateAction<Cart[]>>) {
  const token = localStorage.getItem("customer-token");
  if (token) {
    try {
      const cart = (await axiosClient.get("/cart")).data;
      if (cart && cart.code === 1000) {
        localStorage.setItem("cart", JSON.stringify(cart.result));
        setCart(cart.result);
      } else {
        localStorage.setItem("cart", JSON.stringify([]));
      }
    } catch (error: any) {
      console.log("Get cart error!!!");
    }
  } else {
    const cart: Cart[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cart);
  }
}

export default getCart;
