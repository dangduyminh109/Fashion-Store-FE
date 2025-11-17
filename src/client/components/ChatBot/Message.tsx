import Box from "@mui/material/Box";
type Props = {
  isCustomerMessage?: boolean;
  messageText?: string;
};
export const Message = (props: Props) => {
  const { isCustomerMessage, messageText } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: isCustomerMessage ? "end" : "start",
      }}
    >
      <Box
        sx={{
          p: 1.5,
          bgcolor: "background.paper",
          color: "text.secondary",
          display: "inline-block",
          borderRadius: isCustomerMessage ? "20px 0 20px 20px" : "0 20px 20px 20px",
          maxWidth: "80%",
        }}
        dangerouslySetInnerHTML={{
          __html: messageText || "Xin chào! Bạn cần hỗ trợ gì?",
        }}
      />
    </Box>
  );
};
