import { Search } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { SaleSavantLogo } from "assets";
import { FlexBetween } from "components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";

const Refunds = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState([]);
  const [refund, setRefund] = useState([]);

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

  useEffect(() => {
    const fetchRefundData = async () => {
      try {
        const response = await fetch(`${baseUrl}cashier/get-refunds`);
        if (response.ok) {
          const data = await response.json();
          const refundWithId = data.map((item, index) => ({
            ...item,
            id: index + 1,
          }));
          setRefund(refundWithId);
        } else {
          console.error("Failed to fetch refund data:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
    };

    fetchRefundData();
  }, []);

  const handleButtonClick = (link) => {
    navigate(link);
  };

  const sortedRefund = refund.slice().sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const today = new Date().toLocaleDateString();
  const todayData = sortedRefund.filter(
    (item) => new Date(item.createdAt).toLocaleDateString() === today
  );

  const todayColumns = [
    {
      field: "createdAt",
      headerName: "Date",
      width: 120,
      renderCell: (params) => {
        const date = new Date(params.row.createdAt);
        const formattedDate = `${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date
          .getDate()
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
        return <div>{formattedDate}</div>;
      },
    },
    { field: "orderNo", headerName: "Order No.", width: 100 },
    { field: "paymentType", headerName: "Payment Method", width: 140 },
    { field: "paymentCode", headerName: "Payment Code", width: 160 },
    {
      field: "items",
      headerName: "Item Refunded",
      width: 200,
      renderCell: (params) => {
        const { items } = params.row;
        return (
          <div>
            {items.map((item) => (
              <div key={item.menuItem}>
                {item.quantity} - {item.menuItem}
              </div>
            ))}
          </div>
        );
      },
    },
    { field: "subTotal", headerName: "Sub Total (Php)", width: 160 },
    { field: "totalRefund", headerName: "Amount Refunded (Php)", width: 180 },
    { field: "newAmount", headerName: "New Amount (Php)", width: 160 },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: { xs: "none", sm: "none", md: "block" },
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

      <Box flex="1" margin="3em" marginLeft={{ xs: "3em", md: "25vw" }}>
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
                onClick={() => handleButtonClick("/checkout-list")}
              >
                Checkout
              </Button>
            </Badge>
            <Button
              variant="contained"
              sx={{ background: theme.palette.primary[500] }}
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

          <FlexBetween
            backgroundColor={theme.palette.secondary[700]}
            borderRadius="9px"
            gap="3rem"
            maxWidth="300px"
            width="100%"
            p="0.5rem 1.5rem"
          >
            <InputBase placeholder="Search Order Number..." />
            <Search />
          </FlexBetween>
        </FlexBetween>

        <Typography variant="h3" marginBottom="0.5em">
          {today}, Today
        </Typography>
        <Box
          height="70vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.secondary[700],
              color: theme.palette.secondary[100],
              borderColor: theme.palette.secondary[100],
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.secondary[700],
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.secondary[700],
              color: theme.palette.secondary[100],
              borderColor: theme.palette.secondary[100],
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            rows={todayData}
            columns={todayColumns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 20,
                },
              },
            }}
            pageSizeOptions={[20]}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Refunds;
