import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "~/client/components/PrimaryButton";

export default function NotFound() {
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
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              fontSize: "16rem",
              color: "primary.main",
              lineHeight: "0.8",
            }}
          >
            4
            <Box component={"span"} color={"secondary.main"}>
              0
            </Box>
            4
          </Typography>
          <Typography sx={{ textAlign: "center", fontSize: "6rem" }}>Page Not Found</Typography>
          <PrimaryButton onClick={() => navigate("/")} sx={{ mt: 1, width: "150px" }}>
            Trang Chủ
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}
