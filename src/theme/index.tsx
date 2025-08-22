import { createTheme } from "@mui/material";

export default createTheme({
  typography: {
    fontFamily: ['"Roboto"', "sans-serif"].join(","),
    button: {
      textTransform: "none",
    },
  },
});
