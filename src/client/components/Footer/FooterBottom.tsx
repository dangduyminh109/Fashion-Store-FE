import type { SvgIconComponent } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import MailIcon from "@mui/icons-material/Mail";
import { Link } from "react-router-dom";

import logo from "~/assets/images/Logo/logo-white.png";
import youtubeLogo from "~/assets/images/contactLogo/youtube.png";
import instagramLogo from "~/assets/images/contactLogo/instagram.png";
import facebookLogo from "~/assets/images/contactLogo/facebook.png";
import tiktokLogo from "~/assets/images/contactLogo/tiktok.png";
import zaloLogo from "~/assets/images/contactLogo/zalo.png";
import btcLogo from "~/assets/images/logo_bct.png";
import paymethodLogo from "~/assets/images/logo_paymethod.png";

export function FooterBottomItem({
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
          }}
        >
          {desc}
        </Box>
      </Box>
    </Box>
  );
}

export const FooterBottom = () => {
  return (
    <Box
      className="footer-top native-scroll"
      sx={{
        bgcolor: "background.paper",
        width: "100%",
        overflow: "hidden",
        py: 3,
      }}
    >
      <Box
        sx={{
          width: "80%",
          mx: "auto",
        }}
      >
        <Grid container spacing={2} wrap="wrap">
          <Grid
            size={{
              xs: 12,
              lg: 4,
            }}
            sx={{
              color: "text.secondary",
              mb: "30px",
              pr: "20px",
            }}
          >
            <Box
              sx={{
                mb: "16px",
                maxWidth: "150px",
              }}
            >
              <Link to="/">
                <img src={logo} alt="logo" className="logo" />
              </Link>
            </Box>
            <Box component={"p"} sx={{ mb: "15px", fontWeight: 700, display: "flex" }}>
              <Box mr={"15px"} component={"span"}>
                <BusinessIcon />
              </Box>
              Địa chỉ: 150/8 Nguyễn Duy Cung, Phường 12. Tp.HCM
            </Box>
            <Box component={"p"} sx={{ mb: "15px", fontWeight: 700, display: "flex" }}>
              <Box mr={"15px"} component={"span"}>
                <PhoneAndroidIcon />
              </Box>
              Số điện thoại: 0999999999
            </Box>
            <Box
              component={"p"}
              sx={{
                mb: "15px",
                fontWeight: 700,
                display: "flex",
                "& a": {
                  color: "secondary.main",
                },
              }}
            >
              <Box mr={"15px"} component={"span"}>
                <MailIcon />
              </Box>
              Email: <a href="mailto:support@fashion.com">support@egany.com</a>
            </Box>
            <Box
              component={"p"}
              sx={{
                lineHeight: 1,
                fontƯeight: 600,
                "& a": {
                  color: "secondary.main",
                },
              }}
            >
              © Bản quyền thuộc về
              <a href="#"> FASHIONSTORE</a>
            </Box>
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 8,
            }}
            sx={{
              color: "text.secondary",
            }}
          >
            <Box
              className="top-box"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  color: "text.secondary",
                  "& a": {
                    color: "text.secondary",
                    transition: "0.3s",
                  },
                  "& a:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                <Typography component={"h3"} mb={"5px"} fontWeight={600}>
                  HỖ TRỢ KHÁCH HÀNG
                </Typography>
                <Box component={"ul"} p={0}>
                  <Box
                    component={"li"}
                    sx={{
                      mb: "10px",
                      "& a": {
                        color: "text.secondary",
                      },
                    }}
                  >
                    <Link to={"/"}>Cửa hàng</Link>
                  </Box>
                  <Box
                    component={"li"}
                    sx={{
                      mb: "10px",
                      "& a": {
                        color: "text.secondary",
                      },
                    }}
                  >
                    <Link to={"/"}>Giới thiệu</Link>
                  </Box>
                  <Box
                    component={"li"}
                    sx={{
                      mb: "10px",
                      "& a": {
                        color: "text.secondary",
                      },
                    }}
                  >
                    <Link to={"/"}>Liên Hệ</Link>
                  </Box>
                  <Box
                    component={"li"}
                    sx={{
                      mb: "10px",
                      "& a": {
                        color: "text.secondary",
                      },
                    }}
                  >
                    <Link to={"/"}>Câu hỏi thường gặp</Link>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  color: "text.secondary",
                  "& a": {
                    color: "text.secondary",
                    transition: "0.3s",
                  },
                  "& a:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                <Typography component={"h3"} mb={"5px"} fontWeight={600}>
                  CHÍNH SÁCH
                </Typography>
                <Box component={"ul"} p={0}>
                  <Box
                    component={"li"}
                    sx={{
                      mb: "10px",
                      "& a": {
                        color: "text.secondary",
                      },
                    }}
                  >
                    <Link to={"/"}>Chính sách đổi trả</Link>
                  </Box>

                  <Box
                    component={"li"}
                    sx={{
                      mb: "10px",
                      "& a": {
                        color: "text.secondary",
                      },
                    }}
                  >
                    <Link to={"/"}>Chính sách bảo mật</Link>
                  </Box>
                  <Box
                    component={"li"}
                    sx={{
                      mb: "10px",
                      "& a": {
                        color: "text.secondary",
                      },
                    }}
                  >
                    <Link to={"/"}>Chính sách giao hàng</Link>
                  </Box>
                  <Box
                    component={"li"}
                    sx={{
                      mb: "10px",
                      "& a": {
                        color: "text.secondary",
                      },
                    }}
                  >
                    <Link to={"/"}>Điều khoản dịch vụ</Link>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  color: "text.secondary",
                  "& a": {
                    color: "text.secondary",
                    transition: "0.3s",
                  },
                  "& a:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                <Typography component={"h3"} mb={"5px"} fontWeight={600}>
                  ĐĂNG KÝ NHẬN TIN
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "text.secondary",
                    borderRadius: "999px",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component={"input"}
                    type="text"
                    sx={{
                      border: "none",
                      width: "60%",
                      fontWeight: 600,
                      outline: "none",
                      height: "45px",
                      padding: "0 0 0 15px",
                    }}
                    placeholder="Nhập địa chỉ Email"
                  />
                  <Button
                    sx={{
                      backgroundColor: "secondary.main",
                      color: "text.secondary",
                      borderRadius: "999px",
                      whiteSpace: "nowrap",
                      width: "40%",
                      border: "none",
                      height: "38px",
                    }}
                  >
                    Đăng Kí
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                  }}
                >
                  <Box>
                    <Link to={"/"}>
                      <img src={facebookLogo} />
                    </Link>
                  </Box>
                  <Box>
                    <Link to={"/"}>
                      <img src={zaloLogo} />
                    </Link>
                  </Box>
                  <Box>
                    <Link to={"/"}>
                      <img src={instagramLogo} />
                    </Link>
                  </Box>
                  <Box>
                    <Link to={"/"}>
                      <img src={youtubeLogo} />
                    </Link>
                  </Box>
                  <Box>
                    <Link to={"/"}>
                      <img src={tiktokLogo} />
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className="bottom-box">
              <Box>
                <Link to={"/"}>
                  <img src={btcLogo} />
                </Link>
              </Box>
              <Box>
                <Link to={"/"}>
                  <img src={paymethodLogo} />
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
