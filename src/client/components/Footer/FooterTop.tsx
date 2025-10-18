import Box from "@mui/material/Box";
import PhoneIcon from "@mui/icons-material/Phone";
import type { SvgIconComponent } from "@mui/icons-material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AutorenewIcon from "@mui/icons-material/Autorenew";

function FooterTopItem({
  title,
  desc,
  Icon,
}: {
  title: string;
  desc: string;
  Icon: SvgIconComponent;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "15px",
        alignItems: "center",
        flex: 1,
        lineHeight: 1.4,
        py: "20px",
        color: "text.secondary",
      }}
    >
      <Icon sx={{ fontSize: "4rem", m: 0 }} />
      <Box>
        <Box
          component={"p"}
          sx={{
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Box>
        <Box
          component={"span"}
          sx={{
            fontSize: "1.4rem",
            whiteSpace: "nowrap",
            fontWeight: 600,
          }}
        >
          {desc}
        </Box>
      </Box>
    </Box>
  );
}

export const FooterTop = () => {
  return (
    <Box
      className="footer-top"
      sx={{
        bgcolor: "secondary.main",
        width: "100%",
        overflow: "hidden",
        py: 1,
      }}
    >
      <Box
        className="native-scroll"
        sx={{
          width: "80%",
          mx: "auto",
          overflow: "auto",
          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
        }}
      >
        <Box sx={{ display: "flex", overflow: "auto", gap: "20px" }}>
          <FooterTopItem
            title="Hotline: 19001993"
            desc="Dịch vụ hỗ trợ bạn 24/7"
            Icon={PhoneIcon}
          />
          <FooterTopItem
            title="Quà tặng hấp dẫn"
            desc="Nhiều ưu đãi khuyến mãi hot"
            Icon={CardGiftcardIcon}
          />
          <FooterTopItem title="Đổi trả miễn phí" desc="Trong vòng 7 ngày" Icon={AutorenewIcon} />
          <FooterTopItem
            title="Giá luôn tốt nhất"
            desc="Hoàn tiền nếu nơi khác rẻ hơn"
            Icon={ThumbUpIcon}
          />
        </Box>
      </Box>
    </Box>
  );
};
