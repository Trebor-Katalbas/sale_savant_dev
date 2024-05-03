import {
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FlexBetween, OrderReceipt, TableOrder } from "components";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SaleSavantLogo } from "assets";
import CircleIcon from "@mui/icons-material/Circle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Player } from "@lordicon/react";
import * as assets from "../../../assets/index.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { baseUrl } from "state/api";
import { Search } from "@mui/icons-material";

const CheckoutList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [receipt, setReceipt] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const playerRef = useRef(null);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);

  const fetchReceiptData = async () => {
    try {
      const response = await fetch(`${baseUrl}cashier/get-receipt`);
      if (response.ok) {
        const data = await response.json();
        setReceipt(data.reverse());
      } else {
        console.error("Failed to fetch receipt data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  useEffect(() => {
    fetchReceiptData();
  }, []);

  const handleButtonClick = (link) => {
    navigate(link);
  };

  const toggleReceiptDrawer = (open) => {
    setIsReceiptOpen(open);
  };

  const settings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    swipeToSlide: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1380,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
        },
      },
    ],
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredReceipt = receipt.filter(
    (item) =>
      item.tableNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderNo.toString().includes(searchTerm)
  );

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        width="100%"
      >
        {isDesktop ? (
          <>
            {selectedOrder ? (
              <OrderReceipt
                orderId={selectedOrder._id}
                tableNo={selectedOrder.tableNo}
                orderNo={selectedOrder.orderNo}
                orderType={selectedOrder.orderType}
                paymentType={selectedOrder.paymentType}
                paymentCode={selectedOrder.paymentCode}
                subtotal={selectedOrder.subTotal}
                amountDiscounted={selectedOrder.amountDiscounted}
                totalAmount={selectedOrder.totalAmount}
                items={selectedOrder.items}
                promos={selectedOrder.promoUsed}
                status={selectedOrder.status}
              />
            ) : (
              <Box
                sx={{
                  display: { sm: "none", md: "block" },
                  position: "absolute",
                  top: "30%",
                  left: "3%",
                  textAlign: "center",
                }}
              >
                <img
                  style={{ width: "18vw" }}
                  src={SaleSavantLogo}
                  alt="Sale Savant Logo"
                />
                <h1 style={{ margin: "0" }}> SaleSavant</h1>
              </Box>
            )}
          </>
        ) : (
          <>
            {/* Show Dialog Box OrderReceipt */}
            <Drawer
              container={
                window !== undefined ? () => window.document.body : undefined
              }
              anchor="left"
              open={isReceiptOpen}
              onClose={() => toggleReceiptDrawer(false)}
              ModalProps={{
                keepMounted: true,
              }}
            >
              <IconButton
                sx={{ position: "absolute", top: 5, right: 5, zIndex: 1 }}
                onClick={() => toggleReceiptDrawer(false)}
              >
                <ChevronLeftIcon />
              </IconButton>
              {selectedOrder && (
                <OrderReceipt
                  orderId={selectedOrder._id}
                  tableNo={selectedOrder.tableNo}
                  orderNo={selectedOrder.orderNo}
                  orderType={selectedOrder.orderType}
                  subtotal={selectedOrder.subTotal}
                  amountDiscounted={selectedOrder.amountDiscounted}
                  totalAmount={selectedOrder.totalAmount}
                  items={selectedOrder.items}
                  promos={selectedOrder.promoUsed}
                  status={selectedOrder.status}
                />
              )}
            </Drawer>
          </>
        )}

        <Box
          flex="1"
          margin="3em"
          width={{ sm: "91vw", md: "60vw" }}
          marginLeft={{ xs: "3em", md: "25vw" }}
        >
          <FlexBetween
            sx={{
              flexDirection: { xs: "column", sm: "column", md: "row" },
              gap: "2em",
              marginBottom: "2em",
            }}
          >
            <div style={{ display: "flex", gap: "1em" }}>
              <Button
                variant="contained"
                onClick={() => handleButtonClick("/take-order")}
              >
                New Order
              </Button>
              <Badge
                color="secondary"
                badgeContent={receipt.length}
                invisible={receipt.length === 0}
              >
                <Button
                  variant="contained"
                  sx={{ background: theme.palette.primary[500] }}
                >
                  Checkout
                </Button>
              </Badge>
              <Button
                variant="contained"
                onClick={() => handleButtonClick("/refunds")}
              >
                Refunds
              </Button>
              <Button
                variant="contained"
                onClick={() => handleButtonClick("/cashier-reports")}
              >
                Reports
              </Button>
            </div>

            <Container>
              <FlexBetween
                backgroundColor={theme.palette.secondary[700]}
                borderRadius="20px"
                gap="1rem"
                minWidth="300px"
                p="0.3rem 1.5rem"
              >
                <InputBase
                  placeholder="Search Name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Search />
              </FlexBetween>
            </Container>

            {/* <Box>
              <FormControl color="secondary">
                <InputLabel
                  id="category-label"
                  sx={{ color: theme.palette.primary[200] }}
                >
                  Category
                </InputLabel>
                <Select
                  label="Category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  sx={{
                    width: "180px",
                    border: theme.palette.secondary[300],
                    color: theme.palette.primary[200],
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {category.map((cat) => (
                    <MenuItem key={cat.id} value={cat.categoryName}>
                      {cat.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box> */}

            <Box sx={{ display: "flex", gap: "2em" }}>
              <Box
                sx={{
                  border: "black 1px solid",
                  borderRadius: "5px",
                  display: "flex",
                  gap: "1em",
                  padding: " 0.5em 1em",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.2em",
                  }}
                >
                  <CircleIcon sx={{ color: "#8AF4BA", fontSize: "2em" }} />
                  <Typography variant="h5"> Paid</Typography>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.2em",
                  }}
                >
                  <CircleIcon sx={{ color: "#F4CFCF", fontSize: "2em" }} />
                  <Typography variant="h5"> Unpaid</Typography>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.2em",
                  }}
                >
                  <PendingActionsIcon
                    sx={{ color: "#FF5A5A", fontSize: "2em" }}
                  />
                  <Typography variant="h5"> Pending</Typography>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.2em",
                  }}
                >
                  <CheckCircleIcon sx={{ color: "#00B453", fontSize: "2em" }} />
                  <Typography variant="h5"> Served</Typography>
                </div>
              </Box>
            </Box>
          </FlexBetween>

          <Box display="flex" justifyContent="center" position="relative">
            <Box
              height="70vh"
              sx={{
                background:
                  receipt.length !== 0
                    ? `rgba(90, 90, 90, 0.2) url(${SaleSavantLogo})`
                    : "rgba(90, 90, 90, 0.2)",
                backgroundSize: "300px auto",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "5px",
                padding: { xs: "1em", sm: "1em", md: "3em" },
                width: { xs: "85vw", md: "75vw" },
              }}
            >
              {/* Slider */}
              <FlexBetween>
                <Button
                  variant="text"
                  sx={{ color: theme.palette.primary[300] }}
                  onClick={() => sliderRef.current.slickPrev()}
                >
                  <NavigateBeforeIcon /> Previous
                </Button>

                <Button
                  variant="text"
                  sx={{ color: theme.palette.primary[300] }}
                  onClick={() => sliderRef.current.slickNext()}
                >
                  Next <NavigateNextIcon />
                </Button>
              </FlexBetween>
              {receipt.length === 0 && (
                <>
                  <Typography
                    variant="h2"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      width: "100%",
                      maxWidth: "fit-content",
                      margin: "0 auto",
                      zIndex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Player
                      ref={playerRef}
                      size={96}
                      icon={assets.CartAni}
                      onComplete={() =>
                        setTimeout(
                          () => playerRef.current?.playFromBeginning(),
                          3000
                        )
                      }
                    />
                    No orders for now
                  </Typography>
                </>
              )}
              <Slider ref={sliderRef} {...settings}>
                {filteredReceipt.map((item, index) => (
                  <TableOrder
                    key={index}
                    tableNo={item.tableNo}
                    orderNo={item.orderNo}
                    orderType={item.orderType}
                    totalAmount={item.totalAmount}
                    status={item.status}
                    kitchenStatus={item.kitchenStatus}
                    selectedId={selectedOrderId}
                    selectedTable={selectedTable}
                    onClick={() => {
                      setSelectedOrderId(item._id);
                      setSelectedTable(item.tableNo);
                      setSelectedOrder(item);
                      if (!isDesktop) {
                        toggleReceiptDrawer(true);
                      }
                    }}
                  />
                ))}
              </Slider>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CheckoutList;
