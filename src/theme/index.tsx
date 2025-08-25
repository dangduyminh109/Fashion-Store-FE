import { createTheme } from "@mui/material";

const getTheme = (mode: boolean) => {
  return createTheme({
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
      secondary: {
        main: mode ? "#2A3650" : "#ECFBFF",
        dark: mode ? "#3B4165" : "#E6F5FA",
        light: mode ? "#333E5A" : "#f3fcffff",
      },
      primary: {
        light: mode ? "#40495bff" : "#e8ad91ff",
        main: mode ? "#2A3650" : "#f17544ff",
        dark: mode ? "#3B4165" : "#ea6734ff",
      },
      background: {
        default: mode ? "#364363" : "#fff",
        paper: mode ? "#1E293B" : "#fff",
      },
      text: {
        primary: mode ? "#fff" : "#1F2937",
        secondary: mode ? "#ea6734ff" : "#ea6734ff",
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
            color: mode ? "#fff" : "#1F2937",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "#fff",
            "& .MuiButton-startIcon, & .MuiButton-endIcon": {
              color: "#fff",
            },
            "& .MuiSvgIcon-root": {
              color: "#fff",
            },
          },
        },
      },
    },
  });
};

export default getTheme;
