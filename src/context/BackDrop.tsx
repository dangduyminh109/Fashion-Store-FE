import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { createContext, useState, type ReactNode } from "react";

type BackDropContextType = {
  setBackDrop: React.Dispatch<React.SetStateAction<boolean>>;
};
export const BackDropContext = createContext<BackDropContextType>({
  setBackDrop: () => {},
});

export const BackDrop = ({ children }: { children: ReactNode }) => {
  const [backDrop, setBackDrop] = useState(false);
  return (
    <BackDropContext.Provider value={{ setBackDrop: setBackDrop }}>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={backDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
    </BackDropContext.Provider>
  );
};
