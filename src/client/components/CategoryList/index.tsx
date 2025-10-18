import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import { useSelector } from "react-redux";
import type { RootState } from "~/client/store";
import { SubCategory } from "./SubCategory";

export const CategoryList = ({ isOpen }: { isOpen: boolean }) => {
  const { currentCategory } = useSelector((state: RootState) => state.navbar);

  return (
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <SubCategory data={currentCategory} />
      </List>
    </Collapse>
  );
};
