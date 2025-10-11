import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const PrimaryButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  display: "inline-block",
  background: "transparent",
  border: `1px solid ${theme.palette.primary.main}`,
  position: "relative",
  overflow: "hidden",
  color: "currentColor",
  fontSize: "1.2rem",
  transition: "0.3s",
  zIndex: 1,
  borderRadius: "0",
  "&:hover": {
    color: theme.palette.text.secondary,
  },
  "&::before": {
    content: '""',
    width: "100%",
    position: "absolute",
    backgroundColor: theme.palette.secondary.main,
    bottom: "-90%",
    left: 0,
    zIndex: -1,
    transition: "0.3s",
    height: "100%",
  },
  "&::after": {
    content: '""',
    width: "100%",
    position: "absolute",
    backgroundColor: theme.palette.secondary.main,
    bottom: "-85%",
    left: 0,
    zIndex: -1,
    transition: "0.3s",
    height: "100%",
  },
  "&:hover::after": {
    transform: "translateY(-85%)",
    opacity: 1,
  },
}));

export default PrimaryButton;
