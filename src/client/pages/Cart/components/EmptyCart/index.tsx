import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "~/client/components/PrimaryButton";

export function EmptyCart() {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
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
        <Typography
          sx={{
            p: 1,
            border: `1px dashed ${theme.palette.secondary.main}`,
            color: "secondary.main",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box component="span" sx={{ mr: 1 }}>
            <i className="fa-solid fa-tag" />
          </Box>
          Freeship với đơn hàng trên 3.000.000đ. Mua sắm ngay nào!!!
        </Typography>

        <Box
          sx={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: "60vh",
            display: "flex",
          }}
        >
          <Box
            sx={{
              fontSize: "15rem",
              position: "relative",
              display: "inline-block",
              lineHeight: 1,
              "& .icon-close": {
                position: "absolute",
                top: "-16%",
                right: "-12%",
                fontSize: "8rem",
                color: "secondary.main",
              },
            }}
          >
            <i className="fa-solid fa-cart-shopping" />
            <Box component="span" className="icon-close">
              <i className="fa-solid fa-circle-xmark" />
            </Box>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            “Hổng” có gì trong giỏ hết
          </Typography>

          <Typography>Về trang cửa hàng để chọn mua sản phẩm bạn nhé!</Typography>

          <PrimaryButton onClick={() => navigate("/")} sx={{ mt: 1, width: "150px" }}>
            Mua sắm ngay
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}
