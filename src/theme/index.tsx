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
        main: mode ? "#2A3650" : "#E6F5FA",
        dark: mode ? "#3B4165" : "#fff",
        light: mode ? "#333E5A" : "#fff",
      },
      primary: {
        light: mode ? "#40495bff" : "#e8c2b0ff",
        main: mode ? "#2A3650" : "#f17544ff",
        dark: mode ? "#3B4165" : "#ea6734ff",
      },
      background: {
        default: mode ? "#364363" : "#fff",
        paper: mode ? "#1E293B" : "#FFF2EC",
      },
      text: {
        primary: mode ? "#fff" : "#1F2937",
        secondary: mode ? "#BB86FC" : "#ea6734ff",
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
            color: mode ? "#1F2937" : "#fff",
            backgroundColor: mode ? "#BB86FC" : "#ea6734ff",
            "& .MuiButton-startIcon, & .MuiButton-endIcon": {
              color: mode ? "#1F2937" : "#fff",
            },
            "& .MuiSvgIcon-root": {
              color: mode ? "#1F2937" : "#fff",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontSize: 14,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.text.primary,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.text.secondary,
            },
            "& input:-webkit-autofill": {
              WebkitBoxShadow: `0 0 0 100px transparent inset`,
              WebkitTextFillColor: theme.palette.text.primary,
              caretColor: theme.palette.text.primary,
              transition: "background-color 5000s ease-in-out 0s",
            },
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: ({ theme }) => ({
            "& .MuiInputLabel-root": {
              color: theme.palette.text.primary,
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: theme.palette.text.secondary,
            },
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
            "&.Mui-focused": {
              color: theme.palette.text.secondary,
            },
          }),
        },
      },
    },
  });
};

export default getTheme;
