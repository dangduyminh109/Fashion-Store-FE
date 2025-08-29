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

const Toolbar = ({ addNewLabel, hasTrash }: { addNewLabel?: string; hasTrash: boolean }) => {
  return (
    <Stack direction={"row"} gap={"10px"} flexWrap={"wrap"} justifyContent={"space-between"}>
      <Box sx={{ width: "100%", maxWidth: "350px" }}>
        <FormControl sx={{ mb: 1, width: "100%" }} variant="outlined" size="small">
          <InputLabel
            htmlFor="outlined-adornment-search"
            sx={{
              color: "text.primary",
              "&.Mui-focused": {
                color: "text.secondary",
                bgcolor: "secondary.light",
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
            <Button variant="contained" startIcon={<DeleteIcon />}>
              Thùng Rác
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

export default Toolbar;
