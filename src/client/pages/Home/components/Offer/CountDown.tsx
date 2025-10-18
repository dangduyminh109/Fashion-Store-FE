import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

interface Timer {
  hour: number;
  minute: number;
  second: number;
}

export const CountDown = () => {
  const defaultTime: Timer = {
    hour: 5,
    minute: 59,
    second: 59,
  };
  const [timer, setTimer] = useState<Timer>(defaultTime);

  useEffect(() => {
    const tm = setInterval(() => {
      setTimer((prev) => {
        if (prev.second > 0) {
          return {
            ...prev,
            second: prev.second - 1,
          };
        } else if (prev.second <= 0 && prev.minute > 0) {
          return {
            hour: prev.hour,
            minute: prev.minute - 1,
            second: 59,
          };
        } else if (prev.second <= 0 && prev.minute <= 0 && prev.hour > 0) {
          return {
            hour: prev.hour - 1,
            minute: 59,
            second: 59,
          };
        }
        return defaultTime;
      });
    }, 1000);
    return () => clearInterval(tm);
  }, []);
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
          {timer.hour}
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
          {timer.minute}
        </Box>
        <Box component={"hr"} my={"3px"}></Box>
        <Box component={"span"} fontWeight={500}>
          Phút
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
          {timer.second}
        </Box>
        <Box component={"hr"} my={"3px"}></Box>
        <Box component={"span"} fontWeight={500}>
          Giây
        </Box>
      </Box>
    </Box>
  );
};
