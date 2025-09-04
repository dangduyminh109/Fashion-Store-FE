import {
  Box,
  Stack,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TuneIcon from "@mui/icons-material/Tune";
import AddIcon from "@mui/icons-material/Add";
import { memo, useContext } from "react";
import { ProductContext } from "~/pages/Product";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
interface ToolbarProps {
  addNewLabel?: string;
  hasTrash: boolean;
  handleTrash: () => any;
}
const Toolbar = (Props: ToolbarProps) => {
  const { addNewLabel, hasTrash, handleTrash } = Props;
  const { trash } = useContext(ProductContext);
  return (
    <Stack direction={"row"} gap={"10px"} flexWrap={"wrap"} justifyContent={"space-between"}>
      <Box sx={{ width: "100%", maxWidth: "350px" }}>
        <FormControl sx={{ mb: 1, width: "100%" }} variant="outlined" size="small">
          <InputLabel
            htmlFor="outlined-adornment-search"
            sx={{
              color: "text.primary",
              bgcolor: "background.default",
              "&.Mui-focused": {
                color: "text.secondary",
              },
              p: "0 5px",
            }}
          >
            Tìm Kiếm
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-search"
            fullWidth
            sx={{
              pr: "5px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "text.primary",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "text.secondary",
              },
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="search"
                  sx={{
                    "&:hover svg": {
                      color: "text.secondary",
                    },
                  }}
                >
                  <SearchIcon fontSize="medium" />
                </IconButton>
              </InputAdornment>
            }
          ></OutlinedInput>
        </FormControl>
        <Stack direction={"row"} spacing={2}>
          <Button variant="contained" startIcon={<FilterAltIcon />}>
            Bộ Lọc
          </Button>
          <Button variant="contained" startIcon={<TuneIcon />}>
            Nâng Cao
          </Button>
          {hasTrash && (
            <Button
              variant="contained"
              startIcon={trash ? <KeyboardBackspaceIcon /> : <DeleteIcon />}
              onClick={handleTrash}
            >
              {trash ? "Quay lại" : "Thùng Rác"}
            </Button>
          )}
        </Stack>
      </Box>
      {addNewLabel && (
        <Box>
          <Button variant="contained" startIcon={<AddIcon />}>
            {`thêm mới ${addNewLabel}`}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default memo(Toolbar);
