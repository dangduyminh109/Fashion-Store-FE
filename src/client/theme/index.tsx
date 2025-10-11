import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ['"Roboto"', "sans-serif"].join(","),
    fontSize: 16,
    h1: { fontSize: "3.5rem", fontWeight: 700 },
    h2: { fontSize: "3.5rem", fontWeight: 600 },
    h3: { fontSize: "1.8rem", fontWeight: 600 },
    body1: { fontSize: "1.6rem" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  palette: {
    secondary: {
      main: "#FE7712",
    },
    primary: {
      light: "#40495bff",
      main: "#2A3650",
    },
    background: {
      default: "#fff",
      paper: "#2A3650",
    },
    text: {
      secondary: "#fff",
      primary: "#2A3650",
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
});

export default theme;
