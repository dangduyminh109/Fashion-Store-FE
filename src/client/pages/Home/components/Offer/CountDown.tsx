import Box from "@mui/material/Box";
export const CountDown = () => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <Box component={"p"} fontWeight={500} color={"text.primary"}>
        Kết thúc sau
      </Box>
      <Box
        sx={{
          bgcolor: "secondary.main",
          textAlign: "center",
          borderRadius: "10px",
          lineHeight: 1,
          padding: "3px 5px",
          color: "#fff",
        }}
      >
        <Box component={"strong"} fontSize={"3rem"} padding={"5px 10px"}>
          06
        </Box>
        <Box component={"hr"} my={"3px"}></Box>
        <Box component={"span"} fontWeight={500}>
          Giờ
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: "secondary.main",
          textAlign: "center",
          borderRadius: "10px",
          lineHeight: 1,
          padding: "3px 5px",
          color: "#fff",
        }}
      >
        <Box component={"strong"} fontSize={"3rem"} padding={"5px 10px"}>
          06
        </Box>
        <Box component={"hr"} my={"3px"}></Box>
        <Box component={"span"} fontWeight={500}>
          Giờ
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: "secondary.main",
          textAlign: "center",
          borderRadius: "10px",
          lineHeight: 1,
          padding: "3px 5px",
          color: "#fff",
        }}
      >
        <Box component={"strong"} fontSize={"3rem"} padding={"5px 10px"}>
          06
        </Box>
        <Box component={"hr"} my={"3px"}></Box>
        <Box component={"span"} fontWeight={500}>
          Giờ
        </Box>
      </Box>
    </Box>
  );
};
