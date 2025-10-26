import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

import logo from "~/assets/images/Logo/logo-white.png";
import axiosClient from "~/client/hooks/useFetch";
import type Voucher from "~/client/types/voucher";

export default function ListVoucher({
  openVoucher,
  setOpenVoucher,
  setSelectedVoucher,
  totalPrice,
}: {
  openVoucher: boolean;
  setOpenVoucher: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedVoucher: React.Dispatch<React.SetStateAction<Voucher | null>>;
  totalPrice: number;
}) {
  const [listVoucher, setListVoucher] = useState<Voucher[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const voucher = await axiosClient.get("/voucher");
        if (voucher.data.code == 1000) {
          setListVoucher(voucher.data.result);
        } else if (voucher.data.code != 9401 || voucher.data.code != 9400) {
          toast(voucher.data.result.message);
        }
      } catch (error: any) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Tải dử liệu voucher không thành công! Có lỗi xãy ra!");
        }
      }
    };
    fetchData();
  }, []);

  function handleSelectVoucher(voucher: Voucher) {
    if (voucher.minOrderValue <= totalPrice) {
      setSelectedVoucher(voucher);
      setOpenVoucher(false);
    } else {
      toast.info("Giá trị đơn chưa đủ điều kiện!");
    }
  }

  const SidebarList = (
    <Box sx={{ width: 350, color: "text.secondary" }} role="presentation">
      <Box
        className="header-logo"
        sx={{
          width: "100%",
          height: "50px",
          py: "5px",
          textAlign: "center",
          bgcolor: "secondary.main",
          "& img": {
            objectFit: "contain",
            height: "100%",
            padding: "3px 5px",
            transition: "0.3s ease",
            borderRadius: "5px",
          },
          "&.active img": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <Link to={"/"}>
          <img src={logo} alt="logo" />
        </Link>
      </Box>
      {listVoucher.length > 0 ? (
        <List sx={{ p: 2 }}>
          {listVoucher.map((voucher) => {
            return (
              <ListItem
                key={voucher.id}
                sx={{
                  color: "text.primary",
                  borderRadius: 1,
                  bgcolor: "text.secondary",
                  p: "10px 20px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    fontWeight: 600,
                    flex: 1,
                    lineHeight: 1.4,
                    fontSize: "1.4rem",
                  }}
                >
                  <Box sx={{ display: "flex", mb: "10px" }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "1.6rem",
                          fontWeight: 600,
                          m: 0,
                        }}
                      >
                        {voucher.name}
                      </Typography>
                      <Typography>{voucher.description}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "end" }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography>
                        Mã:{" "}
                        <Box component="strong" sx={{ color: "#000" }}>
                          {voucher.code}
                        </Box>
                      </Typography>
                      {voucher.endDate && (
                        <Typography>
                          Đơn tối thiểu: {voucher.minOrderValue.toLocaleString("vi-VN")}đ
                        </Typography>
                      )}
                      {voucher.endDate && (
                        <Typography>
                          HSD: {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                        </Typography>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      sx={{ height: "30px", bgcolor: "secondary.main" }}
                      onClick={() => handleSelectVoucher(voucher)}
                    >
                      Sử Dụng
                    </Button>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography variant="body1">Không có voucher nào!</Typography>
      )}
    </Box>
  );

  return (
    <Drawer open={openVoucher} onClose={() => setOpenVoucher(false)} anchor={"right"}>
      {SidebarList}
    </Drawer>
  );
}
