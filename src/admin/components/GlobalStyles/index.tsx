import { GlobalStyles } from "@mui/material";

export const GlobalStyle = () => {
  return (
    <GlobalStyles
      styles={(theme) => ({
        "*::-webkit-scrollbar": {
          width: "6px",
          height: "6px",
        },
        "*::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.text.secondary,
          borderRadius: "4px",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: theme.palette.text.secondary,
        },
      })}
    />
  );
};
