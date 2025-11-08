import Drawer from "@mui/material/Drawer";

import { Filter } from "./Filter";

type Props = {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MobileDrawer = (props: Props) => {
  const { drawerOpen, setDrawerOpen } = props;
  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{
        "& *": {
          color: "text.secondary",
        },
        "& .MuiDrawer-paper": {
          p: "10px 0",
        },
        p: 0,
      }}
    >
      <Filter />
    </Drawer>
  );
};
