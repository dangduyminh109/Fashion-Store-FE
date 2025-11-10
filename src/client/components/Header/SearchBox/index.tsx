import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import LogoImg from "~/assets/images/Logo/logo-black.png";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { Fragment, useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import defaultImg from "~/assets/images/default-image.png";
import handlePrice from "~/utils/handlePrice";
import type { RootState } from "~/client/store";
import type { AppDispatch } from "~/admin/store";
import { fetchProduct } from "~/client/features/product/productApi";
import { setTitle } from "~/client/features/product/productSlice";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface SearchBoxProps {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
}

const SearchBox = (props: SearchBoxProps) => {
  const { open, setOpen } = props;
  const [searchValue, setSearchValue] = useState<String>("");
  const timer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { size, listProduct, loading } = useSelector((state: RootState) => state.product);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const dispatch = useDispatch<AppDispatch>();

  async function handleChangeValue(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setSearchValue(e.target.value);
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(async () => {
      if (e.target.value != "") {
        let url = `/product?page=${0}&size=${size}&search=${e.target.value}`;
        dispatch(
          fetchProduct({
            url,
            method: "get",
          })
        );
      }
    }, 300);
  }
  const navigate = useNavigate();
  function handleChooseProduct(slug: string) {
    navigate("/product/" + slug);
    setOpen(false);
  }
  function handleSearch() {
    if (searchValue) {
      navigate("/list-product?search=" + searchValue);
      dispatch(setTitle("Kết quả tìm kiếm: " + searchValue));
      setOpen(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  }

  return (
    <Fragment>
      <BootstrapDialog
        sx={{
          "& .MuiDialog-container": {
            alignItems: "start",
            mt: 5,
          },
        }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 1, bgcolor: "background.default" }}
          id="customized-dialog-title"
        >
          <Box
            component={"img"}
            src={LogoImg}
            alt="logo"
            sx={{
              objectFit: "contain",
              height: "30px",
            }}
          />
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers
          sx={{ bgcolor: "background.default", p: "5px 15px 20px !important" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
              pl: 2,
              pr: 1,
              borderRadius: "999px",
              border: "1px solid #000",
              minWidth: {
                lg: 500,
                md: 400,
                sm: 250,
              },
            }}
          >
            <InputBase
              sx={{ flex: 1 }}
              inputRef={inputRef}
              value={searchValue}
              onChange={(e) => handleChangeValue(e)}
              onKeyDown={handleKeyDown}
              placeholder="Tìm kiếm"
              inputProps={{ "aria-label": "Tìm kiếm" }}
            />
            {loading === "pending" ? (
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search" disabled>
                <CircularProgress sx={{ color: "secondary.main" }} size={"1.6rem"} />
              </IconButton>
            ) : (
              <IconButton
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
                onClick={() => handleSearch()}
              >
                <SearchIcon sx={{ fontSize: "1.6rem" }} />
              </IconButton>
            )}
          </Box>
          {listProduct.length > 0 && (
            <Fragment>
              <Box
                sx={{ px: 2, width: "100%", maxWidth: "600px", overflow: "auto", maxHeight: 400 }}
              >
                {listProduct.map((item, index) => {
                  const price = handlePrice(item.variants);
                  return (
                    <Box onClick={() => handleChooseProduct(item.slug)} key={item.id}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          py: 1,
                        }}
                      >
                        <Box sx={{ flex: 1, pr: 2 }}>
                          <Typography
                            sx={{
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              textOverflow: "ellipsis",
                              transition: "0.3s",
                              "&:hover": {
                                color: "secondary.main",
                              },
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography>
                            <Box component={"strong"} sx={{ color: "secondary.main" }}>
                              {(price.minPromotionPrice > 0
                                ? price.minPromotionPrice
                                : price.minSalePrice
                              ).toLocaleString("VN-vi")}
                              đ
                            </Box>
                            {price.minPromotionPrice > 0 && (
                              <Box
                                component={"small"}
                                sx={{ ml: 1, textDecoration: "line-through" }}
                              >
                                {price.minSalePrice.toLocaleString("VN-vi")}đ
                              </Box>
                            )}
                          </Typography>
                        </Box>
                        <Box
                          component={"img"}
                          src={item.productImages[0] || defaultImg}
                          sx={{ width: 50, height: 50, borderRadius: 1, objectFit: "cover" }}
                        />
                      </Box>
                      {index < listProduct.length - 1 && <Divider />}
                    </Box>
                  );
                })}
              </Box>
            </Fragment>
          )}
        </DialogContent>
      </BootstrapDialog>
    </Fragment>
  );
};

export default SearchBox;
