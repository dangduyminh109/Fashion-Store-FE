import { Fragment } from "react/jsx-runtime";
import Breadcrumb from "~/client/components/Breadcrumb";
import { EmptyCart } from "./components/EmptyCart";
import { useCallback, useContext, useEffect, useRef } from "react";
import { CartContext } from "~/client/context/CartContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Add from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Remove from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import Checkbox from "@mui/material/Checkbox";

import PrimaryButton from "~/client/components/PrimaryButton";
import type CartVariant from "~/client/types/cart";
import { AuthContext } from "~/client/context/AuthContext";
import axiosClient from "~/client/hooks/useFetch";
import type Cart from "~/client/types/cart";
import defaultImg from "~/assets/images/default-image.png";
import { toast } from "react-toastify";

function CartPage() {
  const listBreadcrumb = [
    {
      title: "Trang Chủ",
      url: "/",
    },
    {
      title: "Giỏ Hàng",
      url: `/cart`,
    },
  ];

  const { cart, setCart } = useContext(CartContext);
  const { customer } = useContext(AuthContext);

  const updateCartApi = useRef(
    debounce((variantId: number, quantity: number) => {
      axiosClient.put("/cart", { variantId, quantity });
    }, 1000)
  ).current;

  const handleDecrease = useCallback(
    (cartItem: CartVariant) => {
      if (cartItem.quantity <= 1) {
        return;
      }
      setCart((prev) => {
        return prev.map((item) => {
          if (item.variant.id === cartItem.variant.id && item.quantity > 1) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        });
      });
      if (customer) {
        updateCartApi(cartItem.variant.id, cartItem.quantity - 1);
      }
    },
    [customer]
  );

  const handleIncrease = useCallback(
    (cartItem: CartVariant) => {
      if (cartItem.quantity === cartItem.variant.inventory) {
        toast.info("Đạt số lượng tối đa!!!");
        return;
      }
      setCart((prev) => {
        return prev.map((item) => {
          if (item.variant.id === cartItem.variant.id && item.quantity < item.variant.inventory) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });
      });
      if (customer) {
        updateCartApi(cartItem.variant.id, cartItem.quantity + 1);
      }
    },
    [customer]
  );

  function getPrice(cartItem: CartVariant) {
    let displayPrice = 0;
    let variant = cartItem.variant;
    if (variant) {
      if (
        variant.promotionalPrice &&
        new Date(variant.promotionEndTime).getTime() > Date.now() &&
        new Date(variant.promotionStartTime).getTime() <= Date.now()
      ) {
        displayPrice = variant.promotionalPrice;
      } else {
        displayPrice = variant.salePrice;
      }
    }
    return displayPrice * cartItem.quantity;
  }

  const handleSelectProduct = useCallback(
    (cartItem: CartVariant) => {
      setCart((prev) => {
        return prev.map((item) => {
          if (item.variant.id === cartItem.variant.id) {
            return {
              ...item,
              isSelect: !item.isSelect,
            };
          }
          return item;
        });
      });
    },
    [customer]
  );

  function getTotal() {
    return cart.reduce((total, item) => {
      if (item.isSelect) {
        return total + getPrice(item);
      }
      return 0;
    }, 0);
  }

  async function handleRemoveToCart(cartItem: CartVariant) {
    if (customer) {
      try {
        const data = (await axiosClient.delete("/cart/" + cartItem.variant.id)).data;
        if (data && data.code === 1000) {
          let newCart: Cart[] = cart.filter((item) => item.variant.id != cartItem.variant.id);
          setCart(newCart);
          localStorage.setItem("cart", JSON.stringify(newCart));
          toast.success("Sản phẩm đã được xóa khỏi giỏ!!!");
        }
      } catch (error: any) {
        let message = "Xóa khỏi giỏ không thành công! có lỗi xãy ra!!!";
        toast.error(message);
      }
    } else {
      let newCart: Cart[] = cart.filter((item) => item.variant.id != cartItem.variant.id);
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
      toast.success("Sản phẩm đã được xóa khỏi giỏ!!!");
    }
  }

  useEffect(() => {
    return () => {
      localStorage.setItem("cart", JSON.stringify(cart));
    };
  }, []);

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} />
      {cart && cart.length > 0 ? (
        <Box
          component="section"
          sx={{
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "80%",
              margin: "0 auto",
              overflow: "auto",
              pt: 2,
              pb: 5,
            }}
          >
            <Typography variant="h4" sx={{ width: "100%", fontWeight: 600 }} mb={2}>
              Giỏ hàng
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <Box
                sx={{
                  flex: { xs: "1 1 100%", lg: "1 1 65%" },
                  pr: { lg: 2 },
                  mb: 2,
                }}
              >
                <Box className="order-list" sx={{ maxHeight: "100vh", overflow: "auto" }}>
                  {cart.map((item) => (
                    <Box
                      key={item.variant.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        borderBottom: "1px solid #ccc",
                        py: 1,
                        "&:last-child": { borderBottom: "none" },
                        "& .MuiCheckbox-root": { color: "primary.main" },
                      }}
                    >
                      <IconButton aria-label="delete" onClick={() => handleRemoveToCart(item)}>
                        <CloseIcon />
                      </IconButton>
                      <Checkbox
                        checked={item.isSelect}
                        onChange={() => handleSelectProduct(item)}
                      />
                      <Link to={"/" + item.variant.product.slug}>
                        <Box
                          component="img"
                          src={item.variant.product.productImages[0] || defaultImg}
                          alt="ảnh sản phẩm"
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: "contain",
                          }}
                        />
                      </Link>
                      <Box sx={{ flex: 1 }}>
                        <Link to={"/" + item.variant.product.slug}>
                          <Typography
                            sx={{
                              fontSize: "1.6rem",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              maxWidth: {
                                md: "300px",
                                xs: "200px",
                              },
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              transition: "0.3s ease",
                              "&:hover": {
                                color: "secondary.main",
                              },
                            }}
                          >
                            {item.variant.product.name}
                          </Typography>
                        </Link>
                        <Typography variant="body1">
                          {item.variant.attributeValues.map((item) => item.value).join("-")}
                        </Typography>
                      </Box>

                      <Box textAlign={"end"}>
                        <Typography color="secondary">
                          {getPrice(item).toLocaleString("vi-VN")}đ
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            height: "25px",
                            mt: 1,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                            <IconButton
                              size="small"
                              sx={{
                                bgcolor: "primary.main",
                                height: "100%",
                                aspectRatio: "1/1",
                                borderRadius: "0",
                                color: "text.secondary",
                                transition: "ease 0.3s",
                                "&:hover": {
                                  bgcolor: "secondary.main",
                                },
                              }}
                              onClick={() => handleDecrease(item)}
                            >
                              <Remove />
                            </IconButton>
                            <input
                              type="text"
                              value={item.quantity}
                              readOnly
                              style={{
                                height: "100%",
                                maxWidth: "40px",
                                textAlign: "center",
                                border: "1px solid #000",
                              }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                bgcolor: "primary.main",
                                height: "100%",
                                aspectRatio: "1/1",
                                borderRadius: "0",
                                color: "text.secondary",
                                transition: "ease 0.3s",
                                "&:hover": {
                                  bgcolor: "secondary.main",
                                },
                              }}
                              onClick={() => handleIncrease(item)}
                            >
                              <Add />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box
                className="right-box"
                sx={{
                  flex: { xs: "1 1 100%", lg: "1 1 35%" },
                  bgcolor: "#f5f5f5",
                  p: 2,
                  mt: { xs: 2, lg: 0 },
                  minHeight: {
                    lg: "50vh",
                    md: "30vh",
                    xs: "auto",
                  },
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}>
                  Hóa Đơn
                </Typography>
                <Box component={"ul"}>
                  {cart.map((item) => {
                    if (item.isSelect) {
                      return (
                        <Box
                          component={"li"}
                          sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "150px",
                            }}
                          >
                            ({item.quantity}) x {item.variant.product.name}
                          </Typography>
                          <Typography variant="body1">
                            {getPrice(item).toLocaleString("vi-VN")}đ
                          </Typography>
                        </Box>
                      );
                    }
                  })}
                </Box>
                <Box component={"hr"} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Typography sx={{ textTransform: "uppercase" }}>Tạm Tính</Typography>
                  <Box sx={{ textAlign: "end" }}>
                    <Typography sx={{ fontWeight: 600, color: "secondary.main" }}>
                      {getTotal().toLocaleString("vi-VN")}đ
                    </Typography>
                    <Typography variant="body2">(Chưa áp dụng voucher)</Typography>
                  </Box>
                </Box>
                <PrimaryButton fullWidth sx={{ mt: 1 }}>
                  Thanh toán
                </PrimaryButton>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <EmptyCart />
      )}
    </Fragment>
  );
}

export default CartPage;
