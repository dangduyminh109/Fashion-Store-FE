import { createTheme } from "@mui/material";

export default createTheme({
  typography: {
    fontFamily: ['"Roboto"', "sans-serif"].join(","),
    fontSize: 16,
    h1: { fontSize: "2.4rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 600 },
    h3: { fontSize: "1.8rem", fontWeight: 600 },
    body1: { fontSize: "1.6rem" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#E6F5FA",
      light: "#ECFBFF",
      dark: "#18A0C0",
    },
    secondary: {
      main: "#FFF2EC",
      light: "#E97C52",
    },
    background: {
      default: "#fff",
    },
    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },
    success: {
      main: "#10B981",
    },
    error: {
      main: "#EF4444",
    },
    warning: {
      main: "#F59E0B",
    },
    info: {
      main: "#3B82F6",
    },
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#1F2937",
        },
      },
    },
  },
});
