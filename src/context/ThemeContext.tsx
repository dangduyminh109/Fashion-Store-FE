import { createContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import { useMediaQuery } from "@mui/material";
import getTheme from "~/theme";
import { ThemeProvider } from "@mui/material/styles";

export const ThemeContext = createContext({
  mode: true,
  changeMode: () => {},
});

function getMode(): boolean {
  let getMode = localStorage.getItem("theme");
  if (!getMode) {
    return useMediaQuery("(prefers-color-scheme: dark)");
  } else {
    return getMode === "dark";
  }
}

const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState(getMode());
  const theme = useMemo(() => getTheme(mode), [mode]);

  function changeMode() {
    setMode(!mode);
    localStorage.setItem("theme", mode ? "light" : "dark");
  }

  return (
    <ThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ mode, changeMode }}>{children}</ThemeContext.Provider>
    </ThemeProvider>
  );
};

export default ThemeModeProvider;
