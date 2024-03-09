import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FlexBetween, Header, LineSalesChart, StatBox } from "components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";

const SalesManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [totalSale, setTotalSale] = useState([]);
  const [startCash, setStartCash] = useState(() => {
    const storedStartCash = localStorage.getItem("startCash");
    return storedStartCash ? parseFloat(storedStartCash) : 0;
  });
  const [cashDialogOpen, setCashDialogOpen] = useState(false);

  const handleClickLink = (link) => navigate(link);

  useEffect(() => {
    localStorage.setItem("startCash", startCash);
  }, [startCash]);

  useEffect(() => {
    const fetchTotalSaleStat = async () => {
      try {
        const response = await fetch(
          `${baseUrl}sales-management/get-totalSaleStats`
        );
        if (response.ok) {
          const data = await response.json();
          setTotalSale(data);
        } else {
          console.error(
            "Failed to fetch order sales data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
    };

    fetchTotalSaleStat();

    const intervalId = setInterval(() => {
      fetchTotalSaleStat();
    }, 60000); 

    return () => clearInterval(intervalId);
  }, []);

  const handleCashDialogOpen = () => {
    setCashDialogOpen(true);
  };

  const handleCashDialogClose = () => {
    setCashDialogOpen(false);
  };

  const handleClearCash = () => {
    setStartCash(0);
    setCashDialogOpen(false);
  };

  const handleStartCash = (event) => {
    setStartCash(parseFloat(event.target.value));
  };

  const handleCashDialogConfirm = () => {
    setCashDialogOpen(false);
  };

  const columns = [
    {
      field: "createdAt",
      headerName: "Date",
      width: 180,
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
    { field: "orderNo", headerName: "Starting Cash", width: 180 },
    { field: "paymentType", headerName: "Gross Sales", width: 180 },
    { field: "paymentCode", headerName: "Total Discounts", width: 180 },
    { field: "orderType", headerName: "Refunds", width: 180 },
    { field: "noItems", headerName: "Net Sales", width: 180 },
    { field: "promoUsed", headerName: "Expenses", width: 180 },
    { field: "subTotal", headerName: "Gross Income", width: 180 },
  ];

  return (
    <>
      <Header title={"Sales Tracking"} disp={"none"} />
      <Toolbar>
        <FlexBetween>
          <Box
            sx={{
              display: "flex",
              gap: { xs: "1em", sm: "1em", md: "2em", lg: "2em" },
              flexWrap: { xs: "wrap", sm: "wrap", md: "nowrap", lg: "nowrap" },
            }}
          >
            <Button
              variant="contained"
              sx={{ background: theme.palette.primary[600], fontSize: "1.1em" }}
            >
              Sales
            </Button>
            <Button
              variant="contained"
              size={isDesktop ? "small" : "medium"}
              onClick={() => handleClickLink("/sales management/order-sales")}
              sx={{ fontSize: "1.1em" }}
            >
              Order Sales
            </Button>
            <Button
              variant="contained"
              onClick={() => handleClickLink("")}
              sx={{ fontSize: "1.1em" }}
            >
              Refunded
            </Button>
            <Button
              variant="contained"
              onClick={() => handleClickLink("/sales management/expenses")}
              sx={{ fontSize: "1.1em" }}
            >
              Expenses
            </Button>
          </Box>
        </FlexBetween>
      </Toolbar>

      <Box padding="1em 2em">
        <FlexBetween
          marginBottom="1em"
          gap="2em"
          sx={{
            width:"100%",
            justifyContent:"normal",
            flexDirection: { xs: "column", sm: "row", md: "row", lg: "row" },
          }}
        >
          <Box
            borderRadius="10px"
            height="250px"
            width={{xs:"90vw", sm:"60%", md:"60%", lg:"60%", }}
            sx={{ background: theme.palette.secondary[700] }}
          >
            <LineSalesChart />
          </Box>
          <StatBox
            title={"Total Sales"}
            value={`Php ${totalSale.totalSaleAmount}`}
            increase={totalSale.incomePercentage}
            date={totalSale.totalSaleDate}
            width={{ xs: "100%", sm: "40%", md: "40%", lg: "40%", xl:"40%" }}
            bg={theme.palette.primary[700]}
          />
        </FlexBetween>

        <FlexBetween
          marginBottom="1em"
          gap="2em"
          sx={{
            flexDirection: { xs: "column", sm: "row", md: "row", lg: "row" },
          }}
        >
          <Box display="flex" gap="1em">
            <Tooltip title="This button adds End of Day (EoD) data">
              <Button variant="contained" color="success">
                Add EoD
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              color="success"
              onClick={handleCashDialogOpen}
            >
              Add Start Cash
            </Button>
          </Box>

          <Typography whiteSpace="nowrap">
            Starting Cash:{" "}
            <span
              style={{
                background: theme.palette.secondary[800],
                borderRadius: "5px",
                padding: "0.5em",
              }}
            >
              Php {startCash}
            </span>
          </Typography>
        </FlexBetween>

        <Box
          height="45vh"
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
            rows={[]}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 3,
                },
              },
            }}
            pageSizeOptions={[3]}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>

      <Dialog open={cashDialogOpen} onClose={handleCashDialogClose}>
        <DialogTitle>
          <Typography>Starting Cash</Typography>
        </DialogTitle>
        <DialogContent sx={{ margin: "1em 0" }}>
          <TextField
            color="secondary"
            label="Enter Amount"
            value={startCash}
            type="number"
            onChange={handleStartCash}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearCash} color="error" variant="outlined">
            Clear
          </Button>
          <Button
            onClick={handleCashDialogConfirm}
            color="success"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SalesManagement;
