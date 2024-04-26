import React from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  HomeOutlined,
  ReceiptLongOutlined,
  MenuBookOutlined,
  ManageHistoryOutlined,
  RequestQuoteOutlined,
  ManageAccountsOutlined,
  ExpandMoreOutlined,
  Menu,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FlexBetween } from "../index";
import * as image from "assets/index";

const navItems = [
  {
    text: "Overview",
    icon: null,
  },
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  // {
  //   text: "Reports",
  //   icon: <ReceiptLongOutlined />,
  //   children: [
  //     { text: "Sales", path: "sales-report" },
  //     { text: "Customer Purchase History", path: "purchase-history" },
  //     { text: "Discount and Promos", path: "promos-report" },
  //     { text: "Supplier Deliveries", path: "deliveries-report" },
  //   ],
  // },
  {
    text: "Management",
    icon: null,
  },
  {
    text: "Menu Management",
    icon: <MenuBookOutlined />,
  },
  {
    text: "Supply and Purchase Management",
    icon: <ManageHistoryOutlined />,
    children: [
      { text: "Supply Deliveries Recording", path: "supply-records" },
      { text: "Supplier Management", path: "supplier-management" },
    ],
  },
  {
    text: "Sales Management",
    icon: <RequestQuoteOutlined />,
  },
  {
    text: "Account Management",
    icon: <ManageAccountsOutlined />,
  },
];

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const [openDropdowns, setOpenDropdowns] = useState([]);

  useEffect(() => {
    // Update active state when the pathname changes
    setActive(pathname.substring(1));
  }, [pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    setActive(path.substring(1));
  };

  const handleDropdownToggle = (index) => {
    setOpenDropdowns((prev) => {
      const isOpen = prev.includes(index);
      return isOpen ? prev.filter((item) => item !== index) : [...prev, index];
    });
  };

  return (
    <Box
      component="nav"
      sx={{ boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.27)", zIndex: "99" }}
    >
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[500],
              backgroundColor: theme.palette.primary[500],
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "2px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.palette.secondary[500],
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: theme.palette.primary[700],
              },
            },
          }}
        >
          <Box width="100%">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              m="2rem 0 1rem 0"
            >
              <FlexBetween color={theme.palette.secondary[500]}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap="0.5rem"
                >
                  <img
                    src={image.SaleSavantLogo}
                    alt="logo"
                    style={{ width: "110px", height: "auto" }}
                  />
                  <Typography variant="h4" fontWeight="bold">
                    SaleSavant
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    sx={{
                      position: "absolute",
                      top: "2%",
                      right: "4%",
                      backgroundColor: theme.palette.primary[700],
                    }}
                  >
                    <Menu />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon, children }, index) => {
                const lcText = text.toLowerCase();
                const isDropdownOpen = openDropdowns.includes(index);

                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 0.5rem 2rem" }}>
                      {text}
                    </Typography>
                  );
                }

                return (
                  <React.Fragment key={text}>
                    {/* Dropdown Links */}
                    <ListItem disablePadding>
                      {children ? (
                        <ListItemButton
                          onClick={(event) => {
                            event.preventDefault();
                            handleDropdownToggle(index);
                          }}
                          sx={{
                            backgroundColor:
                              active === lcText
                                ? theme.palette.secondary[500]
                                : "transparent",
                            color:
                              active === lcText
                                ? theme.palette.primary[600]
                                : theme.palette.grey[900],
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              ml: "2rem",
                              color:
                                active === lcText
                                  ? theme.palette.primary[600]
                                  : theme.palette.grey[900],
                            }}
                          >
                            {icon}
                          </ListItemIcon>
                          <ListItemText primary={text} />
                          {isDropdownOpen ? (
                            <ExpandMoreOutlined sx={{ ml: "auto" }} />
                          ) : (
                            <ChevronLeft sx={{ ml: "auto" }} />
                          )}
                        </ListItemButton>
                      ) : (
                        <ListItemButton
                          onClick={() => {
                            handleNavigation(`/${lcText}`);
                          }}
                          sx={{
                            backgroundColor:
                              active === lcText
                                ? theme.palette.secondary[500]
                                : "transparent",
                            color:
                              active === lcText
                                ? theme.palette.grey[200]
                                : theme.palette.grey[900],
                            "&:hover": {
                              backgroundColor: theme.palette.secondary[500],
                              color: theme.palette.grey[200],
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              ml: "2rem",
                              color:
                                active === lcText
                                  ? theme.palette.grey[200]
                                  : theme.palette.grey[900],
                            }}
                          >
                            {icon}
                          </ListItemIcon>
                          <ListItemText primary={text} />
                        </ListItemButton>
                      )}

                      {/* Dropdown Links */}
                    </ListItem>
                    {children && isDropdownOpen && (
                      <List sx={{ pl: "5rem" }}>
                        {children.map(({ text: childText, path }) => (
                          <ListItem
                            key={childText}
                            disablePadding
                            sx={{
                              backgroundColor:
                                active === lcText && pathname.includes(path)
                                  ? theme.palette.secondary[300]
                                  : "transparent",
                              "&:hover": {
                                backgroundColor: theme.palette.secondary[500],
                                color: theme.palette.grey[200],
                              },
                              borderRadius: "10px 0 0 10px",
                            }}
                          >
                            <ListItemButton
                              onClick={(event) => {
                                event.stopPropagation();
                                handleNavigation(`/${lcText}/${path}`);
                              }}
                              sx={{
                                color:
                                  active === lcText && pathname.includes(path)
                                    ? theme.palette.primary[600]
                                    : theme.palette.grey[900],
                              }}
                            >
                              <ListItemText primary={childText} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
