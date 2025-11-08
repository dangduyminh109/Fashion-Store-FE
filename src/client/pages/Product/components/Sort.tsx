import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import FilterListIcon from "@mui/icons-material/FilterList";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "~/client/store";
import type { RootState } from "~/client/store";
import { setSort } from "~/client/features/product/productSlice";
type Props = {
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export const Sort = (props: Props) => {
  const { sort } = useSelector((state: RootState) => state.product);
  const dispatch = useDispatch<AppDispatch>();
  const { setDrawerOpen } = props;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography sx={{ fontWeight: 600 }}>Sắp sếp:</Typography>
      <FormControl
        size="small"
        sx={{
          minWidth: 160,
        }}
      >
        <Select
          value={sort}
          onChange={(e) => dispatch(setSort(e.target.value))}
          sx={{
            fontWeight: 600,
            px: 1,
            borderRadius: "6px",
          }}
        >
          <MenuItem sx={{ color: "text.secondary" }} value="default">
            Mặc định
          </MenuItem>
          <MenuItem sx={{ color: "text.secondary" }} value="asc">
            Giá tăng dần
          </MenuItem>
          <MenuItem sx={{ color: "text.secondary" }} value="desc">
            Giá giảm dần
          </MenuItem>
          <MenuItem sx={{ color: "text.secondary" }} value="a-z">
            Tên A-Z
          </MenuItem>
          <MenuItem sx={{ color: "text.secondary" }} value="z-a">
            Tên Z-A
          </MenuItem>
        </Select>
      </FormControl>

      <IconButton
        aria-label="filter"
        onClick={() => setDrawerOpen(true)}
        sx={{ display: { xs: "inline-flex", lg: "none" } }}
      >
        <FilterListIcon />
      </IconButton>
    </Box>
  );
};
