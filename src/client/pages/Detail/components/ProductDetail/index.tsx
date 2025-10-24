import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { type SelectChangeEvent } from "@mui/material";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import LocalShipping from "@mui/icons-material/LocalShipping";
import AttachMoney from "@mui/icons-material/AttachMoney";
import Replay from "@mui/icons-material/Replay";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import type ProductFeatured from "~/client/types/productFeatured";
import PrimaryButton from "~/client/components/PrimaryButton";
import type Variant from "~/client/types/variant";
import type AttributeValue from "~/client/types/attributeValue";
import { LeftBlock } from "./LeftBlock";
import { CartContext } from "~/client/context/CartContext";
import { toast } from "react-toastify";
import type Cart from "~/client/types/cart";
import { AuthContext } from "~/client/context/AuthContext";
import axiosClient from "~/client/hooks/useFetch";
import type CartVariant from "~/client/types/cart";

function getAttributes(variantList: Variant[]) {
  let attributes: { [key: string]: AttributeValue[] } = {};
  variantList.forEach((variant) => {
    variant.attributeValues.forEach((attr) => {
      let key = attr.attributeName;
      if (!attributes[key]) {
        attributes = {
          ...attributes,
          [key]: [{ ...attr }],
        };
      } else {
        if (!attributes[key].some((atr) => atr.id === attr.id)) {
          attributes = {
            ...attributes,
            [key]: [...attributes[key], { ...attr }],
          };
        }
      }
    });
  });
  return attributes;
}

const RenderPrice = ({ variant }: { variant: Variant | undefined }) => {
  let displayPrice = 0;
  let isPromotion = false;
  if (variant) {
    if (
      variant.promotionalPrice &&
      new Date(variant.promotionEndTime).getTime() > Date.now() &&
      new Date(variant.promotionStartTime).getTime() <= Date.now()
    ) {
      displayPrice = variant.promotionalPrice;
      isPromotion = true;
    } else {
      displayPrice = variant.salePrice;
    }
  }

  return (
    <Fragment>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <Typography sx={{ color: "secondary.main", fontSize: "2.5rem" }} component={"h3"}>
          {displayPrice.toLocaleString("vi-VN")}đ
        </Typography>
        {variant && isPromotion && (
          <>
            <Box display={"flex"} gap={1}>
              <Typography sx={{ textDecoration: "line-through" }}>
                {variant.salePrice.toLocaleString("vi-VN")}đ
              </Typography>
              <Typography
                sx={{
                  bgcolor: "secondary.main",
                  color: "#fff",
                  px: "5px",
                  borderRadius: "999px",
                  display: "inline-block",
                }}
              >
                -{Math.floor(100 - (displayPrice / variant.salePrice) * 100)}%
              </Typography>
            </Box>
          </>
        )}
      </Box>
      {variant && isPromotion && (
        <Box sx={{ mt: 1 }}>
          (Tiết kiệm{" "}
          <Box component="span" sx={{ color: "secondary.main" }}>
            {(variant.salePrice - displayPrice).toLocaleString("vi-VN")}đ
          </Box>
          )
        </Box>
      )}
    </Fragment>
  );
};

interface DisableList {
  [key: string]: number[];
}

interface SelectedAttribute {
  [key: string]: number;
}

export default function ProductDetail({ data }: { data: ProductFeatured | null }) {
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [selectedVarriant, setSelectedVarriant] = useState<Variant | undefined>(undefined);
  const [attributesMap, setAttributes] = useState<{
    [key: string]: AttributeValue[];
  }>({});
  const [selectedAttribute, setSelectedAttribute] = useState<SelectedAttribute>({});
  const [disableAttribute, setDisableAttribute] = useState<DisableList>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data && data?.variants.length > 0) {
      let attributes = getAttributes(data.variants);
      setSelectedVarriant(data?.variants[0]);
      setMaxQuantity(data?.variants[0].inventory);
      setAttributes(attributes);

      let selected = {};
      Object.entries(attributes).forEach(([name, value]) => {
        selected = {
          ...selected,
          [name]: value[0].id,
        };
      });
      setSelectedAttribute(selected);

      let disableList: DisableList = {};

      Object.entries(attributesMap).forEach(([attrName, attrValues]) => {
        attrValues.forEach((attrValue) => {
          // tạo tổ hợp thử nghiệm: các thuộc tính đã chọn + giá trị hiện đang xét
          const testCombination = {
            ...selected,
            [attrName]: attrValue.id,
          };

          // kiểm tra xem tổ hợp này có tồn tại trong variants không
          const isValid = data?.variants.some((variant) =>
            Object.entries(testCombination).every(([_, value]) =>
              variant.attributeValues.some((v) => v.id === value)
            )
          );

          if (!isValid) {
            disableList = {
              ...disableList,
              [attrName]: [...(disableList[attrName] || []), attrValue.id],
            };
          }
        });
      });
      setDisableAttribute(disableList);
    }
  }, [data]);

  function handleDecrease() {
    if (inputRef.current && parseInt(inputRef.current?.value) > 1) {
      inputRef.current.value = `${parseInt(inputRef.current?.value) - 1}`;
    }
  }

  function handleIncrease() {
    if (inputRef.current && parseInt(inputRef.current?.value) < maxQuantity) {
      inputRef.current.value = `${parseInt(inputRef.current?.value) + 1}`;
    }
  }

  function handleChangeVariant(attributeValue: AttributeValue) {
    let newSelectedAttribute = {
      ...selectedAttribute,
      [attributeValue.attributeName]: attributeValue.id,
    };
    setSelectedAttribute(newSelectedAttribute);

    let selectedVariant = data?.variants.find((v) => {
      if (
        Object.entries(newSelectedAttribute).every(([name, atrId]) => {
          return v.attributeValues.some((atrV) => atrV.attributeName === name && atrV.id === atrId);
        })
      ) {
        return v;
      }
    });
    setSelectedVarriant(selectedVariant);
    setMaxQuantity(selectedVariant?.inventory || 0);

    let disableList: DisableList = {};

    Object.entries(attributesMap).forEach(([attrName, attrValues]) => {
      attrValues.forEach((attrValue) => {
        // tạo tổ hợp thử nghiệm: các thuộc tính đã chọn + giá trị hiện đang xét
        const testCombination = {
          ...newSelectedAttribute,
          [attrName]: attrValue.id,
        };

        // kiểm tra xem tổ hợp này có tồn tại trong variants không
        const isValid = data?.variants.some((variant) =>
          Object.entries(testCombination).every(([_, value]) =>
            variant.attributeValues.some((v) => v.id === value)
          )
        );

        if (!isValid) {
          disableList = {
            ...disableList,
            [attrName]: [...(disableList[attrName] || []), attrValue.id],
          };
        }
      });
    });
    setDisableAttribute(disableList);
  }

  function handleChangeSelectVariant(e: SelectChangeEvent) {
    let attributeValue: AttributeValue | undefined = attributesMap[e.target.name].find(
      (item) => item.id == parseInt(e.target.value)
    );
    if (attributeValue) handleChangeVariant(attributeValue);
  }

  const { cart, setCart } = useContext(CartContext);
  const { customer } = useContext(AuthContext);
  async function handleAddToCart() {
    if (inputRef.current && selectedVarriant) {
      if (customer) {
        try {
          const data = (
            await axiosClient.post("/cart", {
              variantId: selectedVarriant.id,
              quantity: parseInt(inputRef.current?.value || "1"),
            })
          ).data;
          if (data && data.code === 1000) {
            let newCart: Cart[] = cart.filter((item) => item.variant.id != data.result.variant.id);
            newCart = [data.result, ...newCart];
            setCart(newCart);
            localStorage.setItem("cart", JSON.stringify(newCart));
            toast.success("Sản phẩm đã được thêm vào giỏ!!!");
          }
        } catch (error: any) {
          let message = "Thêm vào giỏ không thành công! có lỗi xãy ra!!!";
          toast.error(message);
        }
      } else if (data) {
        let isNew = true;
        let newCart: Cart[] = cart.map((item) => {
          if (item.variant.id === selectedVarriant.id) {
            item.quantity =
              item.quantity + parseInt(inputRef.current?.value || "1") > maxQuantity
                ? maxQuantity
                : item.quantity + parseInt(inputRef.current?.value || "1");
            isNew = false;
          }
          return item;
        });

        if (isNew) {
          let { variants, description, ...product } = data;
          newCart = [
            {
              quantity: parseInt(inputRef.current?.value || "1"),
              variant: {
                ...selectedVarriant,
                product: product,
              },
            } as CartVariant,
            ...cart,
          ];
        }
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        toast.success("Sản phẩm đã được thêm vào giỏ!!!");
      } else {
        toast.error("Thêm vào giỏ hàng không thành công!");
      }
    } else {
      toast.error("Thêm vào giỏ hàng không thành công!");
    }
  }

  return (
    <Box
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
          py: 4,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <LeftBlock productImages={data?.productImages} />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h4" fontWeight={600}>
              {data?.name || ""}
            </Typography>
            <Typography sx={{ mr: "30px" }}>
              Thương hiệu: {data?.brandName || "Đang Cập Nhật.."}
            </Typography>
            <Typography>Mã sản phẩm: {selectedVarriant?.sku || "Đang Cập Nhật.."}</Typography>
            <Box
              sx={{
                my: 2,
                borderRadius: "5px",
                overflow: "hidden",
                boxShadow: "rgba(0,0,0,0.02) 0px 1px 3px, rgba(27,31,35,0.15) 0px 0px 0px 1px",
              }}
            >
              <Box
                sx={{
                  bgcolor: "primary.main",
                  p: "5px 10px",
                }}
              >
                <Typography sx={{ color: "#fff", fontWeight: 500 }}>
                  Mua sắm thả ga – Giảm giá cực đã
                </Typography>
              </Box>
              <Box sx={{ p: "5px 10px 10px" }}>
                <Typography variant="body2">Đã bán 195 sản phẩm</Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: "5px",
                    bgcolor: "text.disabled",
                    borderRadius: "999px",
                    overflow: "hidden",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      width: "70%",
                      height: "100%",
                      bgcolor: "secondary.main",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      borderRadius: "999px",
                    },
                  }}
                />
              </Box>
            </Box>

            <RenderPrice variant={selectedVarriant} />

            <Box
              sx={{
                border: "2px dashed #000",
                position: "relative",
                mt: "30px",
              }}
            >
              <Typography
                sx={{
                  position: "absolute",
                  top: 0,
                  left: "5%",
                  transform: "translateY(-50%)",
                  bgcolor: "#fff",
                  px: "10px",
                  fontWeight: 500,
                }}
              >
                🎁 Khuyến mãi - Ưu đãi
              </Typography>
              <Box component="ul" sx={{ p: "20px 20px 20px 40px", m: 0 }}>
                <li>Nhập mã FASHION thêm 5% đơn hàng</li>
                <li>Miễn phí Ship cho đơn hàng từ 300.000đ</li>
                <li>Đổi trả trong 30 ngày nếu sản phẩm lỗi bất kỳ</li>
              </Box>
            </Box>

            <Typography variant="h5" my={2} fontWeight={600}>
              Biến Thể
            </Typography>
            {Object.entries(attributesMap).map(([name, value]) => {
              return (
                <Box sx={{ my: 2 }} key={name}>
                  {value[0].displayType != "SELECT" ? (
                    <Fragment>
                      <Typography>{name}</Typography>
                      <Box sx={{ display: "flex", gap: "10px", m: "5px 5px 0" }}>
                        {value.map((item) => {
                          let isActive = selectedAttribute[item.attributeName] === item.id;
                          let isDisable = disableAttribute[item.attributeName]?.includes(item.id);
                          switch (item.displayType.toUpperCase()) {
                            case "COLOR":
                              return (
                                <Button
                                  key={item.id}
                                  variant="contained"
                                  onClick={() => handleChangeVariant(item)}
                                  disabled={isDisable}
                                  sx={{
                                    aspectRatio: "1/1",
                                    p: 0,
                                    minWidth: "40px",
                                    fontSize: "1.4rem",
                                    borderRadius: "50%",
                                    bgcolor: item.color || "primary.main",
                                    cursor: "pointer",
                                    position: "relative",
                                    m: "2px",
                                    "&::before": {
                                      content: "''",
                                      position: "absolute",
                                      height: "100%",
                                      width: "100%",
                                      borderRadius: "50%",
                                      transform: "scale(1.2)",
                                      top: 0,
                                      left: 0,
                                      border: "2px solid",
                                      borderColor: isActive ? "secondary.main" : "none",
                                    },
                                  }}
                                >
                                  {item.color ? "" : item.value}
                                </Button>
                              );
                            case "IMAGE":
                              return (
                                <Button
                                  key={item.id}
                                  variant={"outlined"}
                                  onClick={() => handleChangeVariant(item)}
                                  disabled={isDisable}
                                  sx={{
                                    height: "35px",
                                    width: "35px",
                                    fontSize: "1.4rem",
                                    cursor: "pointer",
                                    p: 0.2,
                                    minWidth: "20px",
                                    "& img": {
                                      height: "100%",
                                      borderRadius: "3px",
                                      objectFit: "cover",
                                      opacity: isDisable ? 0.3 : 1,
                                    },
                                    border: isActive ? "2px solid" : "1px solid",
                                    borderColor: isActive ? "secondary.main" : "#fff",
                                  }}
                                >
                                  {item.image ? (
                                    <img src={item.image} alt="biến thể" />
                                  ) : (
                                    item.value
                                  )}
                                </Button>
                              );
                            default:
                              return (
                                <Button
                                  key={item.id}
                                  variant={isActive ? "contained" : "outlined"}
                                  onClick={() => handleChangeVariant(item)}
                                  disabled={isDisable}
                                  sx={{
                                    px: "9px",
                                    py: "5px",
                                    fontSize: "1.4rem",
                                    cursor: "pointer",
                                    "&:hover": {
                                      bgcolor: "secondary.main",
                                      color: "text.secondary",
                                    },
                                  }}
                                >
                                  {item.value}
                                </Button>
                              );
                          }
                        })}
                      </Box>
                    </Fragment>
                  ) : (
                    <FormControl fullWidth>
                      <InputLabel
                        id={`variant-select-label-${name}`}
                        sx={{
                          color: "text.primary",
                        }}
                      >
                        {name}
                      </InputLabel>
                      <Select
                        labelId={`variant-select-label-${name}`}
                        id={`variant-select-${name}`}
                        value={selectedAttribute[name].toString()}
                        label={name}
                        size="medium"
                        name={name}
                        onChange={handleChangeSelectVariant}
                      >
                        {value.map((item) => {
                          let isActive = selectedAttribute[item.attributeName] === item.id;
                          let isDisable = disableAttribute[item.attributeName]?.includes(item.id);
                          return (
                            <MenuItem
                              key={item.id}
                              disabled={isDisable}
                              selected={isActive}
                              value={item.id}
                              sx={{
                                color: "text.secondary",
                              }}
                            >
                              {item.value}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                </Box>
              );
            })}

            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px", height: "40px" }}>
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
                    onClick={() => handleDecrease()}
                  >
                    <Remove />
                  </IconButton>
                  <input
                    type="text"
                    ref={inputRef}
                    value={1}
                    style={{
                      height: "100%",
                      maxWidth: "80px",
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
                    onClick={() => handleIncrease()}
                  >
                    <Add />
                  </IconButton>
                </Box>

                <PrimaryButton
                  disabled={maxQuantity == 0}
                  sx={{
                    padding: "10px 20px",
                    height: "40px",
                    width: "100%",
                    "&.Mui-disabled": {
                      color: "text.primary",
                    },
                  }}
                  onClick={() => handleAddToCart()}
                >
                  {maxQuantity == 0 ? "Hết Hàng" : "Thêm vào giỏ"}
                </PrimaryButton>
              </Box>

              <Button
                disabled={maxQuantity == 0}
                sx={{
                  mt: 1,
                  height: "40px",
                  width: "100%",
                  bgcolor: "primary.main",
                  color: "#fff",
                  fontSize: "1.6rem",
                  transition: "ease 0.3s",
                  "&:hover": {
                    bgcolor: "secondary.main",
                  },
                  "&.Mui-disabled": {
                    color: "text.secondary",
                  },
                }}
              >
                {maxQuantity == 0 ? "Hết Hàng" : "Mua Ngay"}
              </Button>

              <Box
                sx={{
                  textAlign: "center",
                  mt: 1,
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                Gọi đặt mua <Box sx={{ color: "secondary.main", fontWeight: 600 }}> 1910.0000 </Box>
                (7:30 - 22:00)
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                {[
                  { icon: <LocalShipping />, text: "Giao hàng toàn quốc" },
                  { icon: <Replay />, text: "Tích điểm tất cả sản phẩm" },
                  { icon: <AttachMoney />, text: "Giảm 5% khi thanh toán online" },
                ].map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      gap: "5px",
                      fontSize: "1.4rem",
                      alignItems: "center",
                    }}
                  >
                    {item.icon}
                    <Typography>{item.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
