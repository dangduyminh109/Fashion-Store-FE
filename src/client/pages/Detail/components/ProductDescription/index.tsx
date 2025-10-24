import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Props = {
  description: string | undefined;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const ProductDescription = (props: Props) => {
  const [value, setValue] = useState(0);
  const { description } = props;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "80%",
          margin: "0 auto",
          overflow: "auto",
          py: 4,
          "& *": {
            color: "text.primary",
          },
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="product description tab"
              sx={{
                "& .MuiTabs-list": {
                  justifyContent: "center",
                },
                color: "text.primary",
              }}
            >
              <Tab
                label="Mô Tả"
                {...a11yProps(0)}
                sx={{ color: "text.primary", fontSize: "1.6rem" }}
              />
              <Tab
                label="Chính Sách Giao Hàng"
                {...a11yProps(1)}
                sx={{ color: "text.primary", fontSize: "1.6rem" }}
              />
              <Tab
                label="Chính Sách Đổi Trả"
                {...a11yProps(2)}
                sx={{ color: "text.primary", fontSize: "1.6rem" }}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Box dangerouslySetInnerHTML={{ __html: description || "" }} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Typography variant="body1" sx={{ my: 1 }}>
              Khách nhận hàng tại Store. (Khách mua hàng trực tiếp tại các store)
            </Typography>
            <Typography variant="body1" sx={{ my: 1 }}>
              Giao hàng tận nơi (Khách được chọn khi đặt hàng tại website hoặc trên Facebook)
            </Typography>
            <Box component={"ul"} sx={{ listStyle: "outside", pl: 3, my: 1 }}>
              <Box component={"li"}>
                Nội thành TPHCM: Dự kiến trong 24h kể từ khi đơn hàng được xác nhận.
              </Box>
              <Box component={"li"}>
                Tuyến tỉnh: Dự kiến trong 3-4 ngày kể từ khi đơn hàng được xác nhận.
              </Box>
            </Box>
            <Typography variant="body1" sx={{ my: 1 }}>
              OLD SAILOR sẽ giao hàng trong giờ hành chính (8h- 17h), nếu có bất kỳ yêu cầu nhận
              hàng nào ngoài thời gian này quý khách vui lòng gửi yêu cầu cho OLD SAILOR tại thời
              điểm mua hàng. Trường hợp không đáp ứng được thời gian dự kiến trên do các lý do khách
              quan/chủ quan OLD SAILOR sẽ liên hệ đến quý khách hàng để thỏa thuận lại. Trong trường
              hợp giao hàng chậm trễ mà không báo trước, quý khách có thể từ chối nhận hàng và chúng
              tôi sẽ hoàn trả toàn bộ số tiền mà quý khách trả trước (nếu có) trong vòng 7 – 10
              ngày.
            </Typography>
            <Typography variant="body1" sx={{ my: 1 }}>
              Công ty cam kết tất cả hàng hóa gởi đến quý khách đều là hàng chính hãng mới 100%.
              Những rủi ro phát sinh trong quá trình vận chuyển có thể ảnh hưởng đến hàng hóa, vì
              thế xin Quý Khách vui lòng kiểm tra hàng hóa thật kỹ trước khi ký nhận. OLD SAILOR sẽ
              không chịu trách nhiệm với những sai lệch hình thức của hàng hoá sau khi Quý khách đã
              ký nhận hàng.
            </Typography>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Typography variant="h5" sx={{ fontWeight: 600, my: 1 }}>
              1. Lưu Ý khi nhận hàng:
            </Typography>
            <Box component={"ul"} sx={{ listStyle: "outside", pl: 3, my: 1 }}>
              <Box component={"li"}>Khách hàng có thể kiểm tra hàng trước khi nhận</Box>
              <Box component={"li"}>
                Nếu không vừa ý với sản phẩm khách hàng có thể từ chối nhận. Nếu ưng ý, Khách nhận
                hàng và thanh toán cho shipper.
              </Box>
              <Box component={"li"}>
                Trường hợp hàng đã nhận khách hàng vẫn có thể ĐỔI trong 14 ngày (sản phẩm phải còn
                nguyên tem mác & hoá đơn)
              </Box>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600, my: 1 }}>
              2. Quy định về phí đổi / trả hàng:
            </Typography>
            <Typography variant="body1" sx={{ my: 1 }}>
              Đối với khách hàng thanh toán Cod:
            </Typography>
            <Box component={"ul"} sx={{ listStyle: "outside", pl: 3, my: 1 }}>
              <Box component={"li"}>
                Tất cả đơn hàng khách hàng sẽ chịu phí ship 2 chiều (phí ship gửi đi và phí đổi
                hàng)
              </Box>
              <Box component={"li"}>
                Trường hợp đổi hàng do lỗi sai do hàng hóa lỗi, gửi nhầm size, nhầm màu… phí ship
                tính vào chi phí của Old Sailor
              </Box>
            </Box>
            <Typography variant="body1" sx={{ my: 1 }}>
              Với khách hàng đã thanh toán và muốn đổi trả :
            </Typography>
            <Typography variant="body1" sx={{ my: 1 }}>
              Tư vấn viên sẽ hướng dẫn khách hàng các bước cần thiết để tiến hành trả đổi trả.
            </Typography>
            <Typography variant="body1" sx={{ my: 1 }}>
              Khách hàng được hỗ trợ đổi hàng với trường hợp mẫu mã không vừa hoặc không ưng. Khách
              hàng đổi trực tiếp tại hệ thống cửa hàng OLD SAILOR trên toàn quốc hoặc có thể liên hệ
              online để đổi hàng . Hàng hóa khi đổi cần được giữ nguyên tem mác và chưa qua sử dụng,
              giặt tẩy.
            </Typography>
            <Box component={"ul"} sx={{ listStyle: "outside", pl: 3, my: 1 }}>
              <Box component={"li"}>Sản phẩm được tặng shop ko hỗ trợ đổi và trả</Box>
              <Box component={"li"}>Sản phẩm SALE không trả hàng</Box>
            </Box>
            <Typography variant="body1" sx={{ my: 1 }}>
              Phí đổi/trả hàng:
            </Typography>
            <Box component={"ul"} sx={{ listStyle: "outside", pl: 3, my: 1 }}>
              <Box component={"li"}>
                Trường hợp khách Đổi Hàng do các vấn đề khác : Phí Vận chuyển Khách hàng sẽ chịu phí
                vận chuyển 2 chiều
              </Box>
              <Box component={"li"}>Sản phẩm PHỤ KIỆN,LOT,NGỦ,BƠI shop không hổ trợ đổi trả</Box>
              <Box component={"li"}>
                CTKM (SALE) bạn muốn đổi size vui lòng nhận hàng thanh toán đầy đủ báo lại shop
                ,shop hỗ trợ mình đổi trong vòng 14 ngày kể từ ngày ra HD
              </Box>
              <Box component={"li"}>
                Trường hợp khách trả hàng do không ưng ( đơn nguyên giá - không sale ) : Khách phải
                chịu Phí Dịch Vụ : 10% tổng giá trị đơn hàng
              </Box>
            </Box>
            <Typography variant="body1" sx={{ my: 1 }}>
              Lưu ý: nếu không nhận hàng thì Khách Hàng KHÔNG cần thanh toán bất cứ khoản phí nào
              cho shipper Hàng vận chuyển đến Khách Hàng sau khoảng 3-5 ngày, trừ T7 & CNa
            </Typography>
          </CustomTabPanel>
        </Box>
      </Box>
    </Box>
  );
};
