import Box from "@mui/material/Box";
import { FooterTop } from "./FooterTop";
import { FooterBottom } from "./FooterBottom";
export const Footer = () => {
  return (
    <Box component={"footer"}>
      <FooterTop />
      <FooterBottom />
    </Box>
  );
};
