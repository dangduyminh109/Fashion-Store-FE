import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CategoryItem } from "./CategoryItem";

export function Category() {
  return (
    <Box
      component="section"
      id="category"
      sx={{
        width: "100%",
        py: 5,
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Typography variant="h2" sx={{ textAlign: "center" }} mb={3}>
        Danh Mục Sản Phẩm
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          width: "80%",
          margin: "10px auto",
          overflow: "auto",
        }}
        className="native-scroll"
      >
        <CategoryItem />
        <CategoryItem />
        <CategoryItem />
        <CategoryItem />
        <CategoryItem />
        <CategoryItem />
      </Box>
    </Box>
  );
}
