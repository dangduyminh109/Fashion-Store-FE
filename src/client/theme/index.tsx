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

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body {
          scrollbar-width: thin;
          scrollbar-color: #2A3650 transparent !important;
          overflow: "overlay"
        }

        *::-webkit-scrollbar {
          width: 8px !important;
          height: 8px !important;
        }

        *::-webkit-scrollbar-button {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        *::-webkit-scrollbar-thumb {
          background-color: #2A3650;
          border-radius: 8px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background-color: #2A3650;
        }

        *::-webkit-scrollbar-track {
          background-color: transparent !important;
        }
      `,
    },
  },
});

export default theme;
