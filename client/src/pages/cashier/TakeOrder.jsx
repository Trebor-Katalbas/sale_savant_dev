import { useTheme } from "@emotion/react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import * as image from "assets/index.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";
const getOrderType = () => {
  return localStorage.getItem("orderType");
};

const getOrderNo = () => {
  return localStorage.getItem("orderNo");
};

const TakeOrder = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState([]);

  const actions = [
    {
      icon: <ShoppingCartIcon />,
      name: "Checkout",
      badgeContent: receipt.length,
    },
    { icon: <ProductionQuantityLimitsIcon />, name: "Refunds" },
    { icon: <TableRestaurantIcon />, name: "Modify Table" },
  ];

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const response = await fetch(`${baseUrl}cashier/get-receipt`);
        if (response.ok) {
          const data = await response.json();
          setReceipt(data);
        } else {
          console.error("Failed to fetch receipt data:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
    };

    fetchReceiptData();
  }, []);

  const handleOrderClick = (link) => {
    navigate(link);
  };

  const orderNo = Math.floor(1000 + Math.random() * 9000)
    .toString()
    .padStart(4, "0");

  const handleOrderTypeSelect = (type, number) => {
    localStorage.setItem("orderType", type);
    localStorage.setItem("orderNo", number);
  };

  const handleDialClick = (action, number) => {
    switch (action) {
      case "Checkout":
        navigate("/checkout-list");
        break;
      case "Refunds":
        navigate("/refunds");
        break;
      case "Modify Table":
        navigate("/modify-table");
        break;
      default:
        break;
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        margin: { xs: "2em", md: "2em 8em", lg: "2em 10em", xl: "4em 10em" },
      }}
      height="80vh"
    >
      <Card
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: theme.palette.grey[300],
        }}
      >
        <img
          src={image.SaleSavantLogo}
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "380px",
            padding: "0 2em",
          }}
          alt="SaleSavantLogo"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h3"
            component="div"
            sx={{ color: theme.palette.secondary[400], fontWeight: "600" }}
          >
            SaleSavant
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            gap: { xs: "1em", md: "5em", lg: "10em" },
            whiteSpace: "nowrap",
          }}
        >
          <Button
            sx={{
              fontSize: "1.2em",
              padding: "0.5em 1.5em",
              background: theme.palette.primary[600],
              color: theme.palette.secondary[500],
              fontWeight: "bold",
            }}
            variant="contained"
            onClick={() => {
              handleOrderClick("/order-ticket");
              handleOrderTypeSelect("Dine-In", orderNo);
            }}
          >
            Dine-In
          </Button>
          <Button
            sx={{
              fontSize: "1.2em",
              padding: "0.5em 1.5em",
              background: theme.palette.primary[600],
              color: theme.palette.secondary[500],
              fontWeight: "bold",
            }}
            variant="contained"
            onClick={() => {
              handleOrderClick("/order-ticket");
              handleOrderTypeSelect("Take-out", orderNo);
            }}
          >
            Take-Out
          </Button>
        </CardActions>
        <Badge
          sx={{ position: "absolute", top: 16, right: 16 }}
          color="secondary"
          variant="dot"
          badgeContent={receipt.length}
          invisible={receipt.length === 0}
        >
          <SpeedDial
            ariaLabel="Menu"
            icon={<SpeedDialIcon openIcon={<RestaurantMenuIcon />} />}
            direction="down"
          >
            {actions.map((action) => (
              <SpeedDialAction
                sx={{ width: "4.5em", height: "4.5em" }}
                key={action.name}
                icon={
                  action.name === "Checkout" ? (
                    <Badge
                      badgeContent={action.badgeContent}
                      color="secondary"
                      size="small"
                    >
                      {action.icon}
                    </Badge>
                  ) : (
                    action.icon
                  )
                }
                tooltipTitle={action.name}
                onClick={() => handleDialClick(action.name)}
              />
            ))}
          </SpeedDial>
        </Badge>
      </Card>
    </Box>
  );
};

export { getOrderType, getOrderNo };
export default TakeOrder;
