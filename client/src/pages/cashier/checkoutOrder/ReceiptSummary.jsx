import { Box, Button, Divider, Typography, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import * as image from "assets/index";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "state/api";
import { FlexBetween } from "components";
import { Player } from "@lordicon/react";
import * as assets from "../../../assets/index.js";

const ReceiptSummary = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderSale, setOrderSale] = useState({});
  const playerRef = useRef(null);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);

  useEffect(() => {
    const fetchOrderSaleData = async () => {
      try {
        const response = await fetch(`${baseUrl}cashier/get-receipt/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrderSale(data);
        } else {
          console.error(
            "Failed to fetch order sale data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
    };

    fetchOrderSaleData();
  }, [id]);

  const handleClickButton = (link) => {
    navigate(link);
  };

  const change = orderSale.amountPaid - orderSale.totalAmount

  return (
    <>
      <Box display="flex" height="93vh">
        <Box
          sx={{
            background: theme.palette.primary[800],
            boxShadow: "0 0 20px 0px rgba(0, 0, 0, 0.35)",
            display: "flex",
            margin: "0",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            "@media (max-width:430px)": {
              display: "none",
            },
          }}
          width="45%"
        >
          <img
            src={image.SaleSavantLogo}
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "400px",
            }}
            alt="SaleSavantLogo"
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: "600",
              textAlign: "center",
              color: "#B03021",
              padding: "0 1em",
            }}
          >
            Order No. {orderSale.orderNo}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "600",
              color: "#B03021",
            }}
          >
            Paid!
          </Typography>
        </Box>

        <Box
          sx={{
            background: "#fff",
            display: "flex",
            alignItems: "center",
            flexDirection:"column",
            justifyContent: "center",
            "@media (max-width:1024px)": {
              width: "100%",
            },
          }}
          width="55%"
          padding="2em"
        >
          <Player
            ref={playerRef}
            size={150}
            icon={assets.Coins}
            onComplete={() =>
              setTimeout(() => playerRef.current?.playFromBeginning(), 4000)
            }
          />
          <Box width="100%">
            <Box
              sx={{
                background: theme.palette.grey[800],
                borderRadius: "6px 6px 0 0",
                color: "#fff",
                padding: "1em",
              }}
            >
              <FlexBetween>
                <Typography>
                  Order No. <span>{orderSale.orderNo}</span>
                </Typography>
                <Typography sx={{ color: "#1CDE75" }}>
                  {orderSale.orderType}
                </Typography>
              </FlexBetween>

              <Divider sx={{ background: "#fff" }} />

              <FlexBetween paddingTop="1em">
                <Typography sx={{ fontWeight: "200" }}>
                  Payment Method
                </Typography>
                <Typography sx={{ fontWeight: "200" }}>
                  {orderSale.paymentType}
                </Typography>
              </FlexBetween>
              <FlexBetween paddingTop="1em">
                <Typography sx={{ fontWeight: "200" }}>
                  Transaction Code
                </Typography>
                <Typography sx={{ fontWeight: "200" }}>
                  {orderSale.paymentCode}
                </Typography>
              </FlexBetween>
            </Box>
            <Divider sx={{ background: "#fff" }} />
            <Box
              sx={{
                background: theme.palette.grey[800],
                borderRadius: "0 0 6px 6px",
                color: "#fff",
                padding: "1em",
                marginTop: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8em",
                  padding: "0 0.5em",
                }}
              >
                <FlexBetween>
                  <Typography sx={{ fontWeight: "200" }}>
                    Includes Vat
                  </Typography>
                  <Typography sx={{ fontWeight: "200" }}>
                    {" "}
                    ---------{" "}
                  </Typography>
                </FlexBetween>
                <FlexBetween>
                  <Typography sx={{ fontWeight: "200" }}>Subtotal</Typography>
                  <Typography sx={{ fontWeight: "200" }}>
                    {orderSale.subTotal}
                  </Typography>
                </FlexBetween>
                <FlexBetween>
                  <Typography sx={{ fontWeight: "200" }}>Discount</Typography>
                  <Typography sx={{ fontWeight: "200", color: "#FF97A1" }}>
                    -{orderSale.amountDiscounted}
                  </Typography>
                </FlexBetween>
                <FlexBetween>
                  <Typography sx={{ fontWeight: "600" }}>Total</Typography>
                  <Typography sx={{ fontWeight: "600" }}>
                    Php {orderSale.totalAmount}
                  </Typography>
                </FlexBetween>
                <Divider sx={{ background: "#fff" }} />
                <FlexBetween>
                  <Typography sx={{ fontWeight: "200" }}>
                    Amount Paid
                  </Typography>
                  <Typography sx={{ fontWeight: "200" }}>
                    Php {orderSale.amountPaid}
                  </Typography>
                </FlexBetween>
                <FlexBetween>
                  <Typography sx={{ fontWeight: "600" }}>Change</Typography>
                  <Typography sx={{ fontWeight: "600" }}>
                    Php {change.toFixed(2)}
                  </Typography>
                </FlexBetween>
              </div>
              <Divider sx={{ marginTop: "1em" }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.5em",
                  margin: "1em",
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleClickButton("/take-order")}
                >
                  New Order
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ whiteSpace: "nowrap" }}
                  onClick={() => handleClickButton("/checkout-list")}
                >
                  Go Back
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ReceiptSummary;
