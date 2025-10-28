import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import PrimaryButton from "~/client/components/PrimaryButton";

export default function Success() {
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
              position: "relative",
              display: "inline-block",
              lineHeight: 1,
            }}
          >
            <ShoppingCartIcon fontSize="large" sx={{ fontSize: "15rem" }} />
            <CheckCircleIcon
              fontSize="large"
              color="success"
              sx={{
                position: "absolute",
                top: "-16%",
                right: "-12%",
                fontSize: "8rem",
              }}
            />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            Thanh Toán Thành Công
          </Typography>

          <Typography>Đơn hàng sẽ được giao đến bạn trong thời gian sớm nhất!</Typography>

          <PrimaryButton onClick={() => navigate("/")} sx={{ mt: 1, width: "150px" }}>
            Tiếp tục mua sắm
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}
