import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { FlexBetween, Header, LineSalesChart, StatBox } from "components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";

const SalesManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [totalSale, setTotalSale] = useState([]);
  const [eod, setEOD] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cashDialogOpen, setCashDialogOpen] = useState(false);
  const [startCash, setStartCash] = useState(() => {
    const storedStartCash = localStorage.getItem("startCash");
    return storedStartCash ? parseFloat(storedStartCash) : 0;
  });
  const [coinQuantities, setCoinQuantities] = useState(() => {
    const storedCoinQuantities = JSON.parse(
      localStorage.getItem("coinQuantities")
    );
    return (
      storedCoinQuantities || {
        0.05: 0,
        0.1: 0,
        0.25: 0,
        1: 0,
        5: 0,
        10: 0,
        20: 0,
        50: 0,
        100: 0,
        200: 0,
        500: 0,
        1000: 0,
      }
    );
  });

  useEffect(() => {
    localStorage.setItem("startCash", startCash);
    localStorage.setItem("coinQuantities", JSON.stringify(coinQuantities));
  }, [startCash, coinQuantities]);

  const handleInputChange = (denomination, event) => {
    const value = event.target.value;
    setCoinQuantities((prevState) => ({
      ...prevState,
      [denomination]: value === "" ? "" : parseInt(value),
    }));
  };

  const calculateTotal = () => {
    let total = startCash;
    if (total === 0) {
      Object.entries(coinQuantities).forEach(([denomination, quantity]) => {
        total += denomination * quantity;
      });
    }
    return total;
  };

  const handleCashDialogConfirm = () => {
    const totalCash = calculateTotal();
    setStartCash(totalCash);
    setCashDialogOpen(false);
    console.log("Start cash and coin quantities:", startCash, coinQuantities);
  };

  const handleClickLink = (link) => navigate(link);

  useEffect(() => {
    localStorage.setItem("startCash", startCash);
  }, [startCash]);

  console.log(eod);

  const fetchEOD = async () => {
    try {
      const response = await fetch(`${baseUrl}home/get-eod`);
      if (response.ok) {
        const data = await response.json();
        const eodWithId = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setEOD(eodWithId);
      } else {
        console.error("Failed to fetch eod data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };
  useEffect(() => {
    fetchEOD();
  }, []);

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
    setCoinQuantities(
      Object.fromEntries(Object.keys(coinQuantities).map((key) => [key, 0]))
    );
    setCashDialogOpen(false);
  };

  const handleDelete = (_id) => {
    setDeleteDialogOpen(true);
    setSelectedItemId(_id);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${baseUrl}home/delete-eod/${selectedItemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`EOD with ID ${selectedItemId} deleted successfully`);
        fetchEOD();
      } else {
        console.error("Failed to delete eod:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the delete:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const columns = [
    {
      field: "date",
      headerName: "Date",
      width: 180,
      renderCell: (params) => {
        const date = new Date(params.row.date);
        const formattedDate = `${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date
          .getDate()
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
        return <div>{formattedDate}</div>;
      },
    },
    { field: "startCash", headerName: "Starting Cash", width: 180 },
    { field: "grossSales", headerName: "Gross Sales (Php)", width: 180 },
    {
      field: "totalDiscounts",
      headerName: "Total Discounts (Php)",
      width: 180,
    },
    { field: "refunds", headerName: "Refunds (Php)", width: 180 },
    { field: "netSales", headerName: "Net Sales (Php)", width: 180 },
    { field: "expenses", headerName: "Expenses (Php)", width: 180 },
    { field: "grossIncome", headerName: "Gross Income (Php)", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "1em" }}>
          <DeleteForeverIcon
            onClick={() => handleDelete(params.row._id)}
            sx={{
              color: theme.palette.secondary[400],
              cursor: "pointer",
              fontSize: "2.5em",
            }}
          />
        </div>
      ),
    },
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
              onClick={() =>
                handleClickLink("/sales management/refund-records")
              }
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
            width: "100%",
            justifyContent: "normal",
            flexDirection: { xs: "column", sm: "row", md: "row", lg: "row" },
          }}
        >
          <Box
            borderRadius="10px"
            height="250px"
            width={{ xs: "90vw", sm: "60%", md: "60%", lg: "60%" }}
            sx={{ background: theme.palette.secondary[700] }}
          >
            <LineSalesChart
              data={eod.map((item) => ({
                x: formatDate(item.date),
                y: item.grossSales,
              }))}
            />
          </Box>
          <StatBox
            title={"Total Sales"}
            value={`Php ${totalSale.totalSaleAmount}`}
            increase={totalSale.incomePercentage}
            date={totalSale.totalSaleDate}
            width={{ xs: "100%", sm: "40%", md: "40%", lg: "40%", xl: "40%" }}
            height={{
              xs: "15vh",
              sm: "15vh",
              md: "35vh",
              lg: "35vh",
              xl: "25vh",
            }}
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
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  handleClickLink(`/add eod/start-cash/${startCash}`)
                }
              >
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
            rows={eod}
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
        <DialogTitle sx={{ background: theme.palette.primary[700] }}>
          Starting Cash
        </DialogTitle>
        <DialogContent sx={{ background: theme.palette.primary[700] }}>
          <Typography variant="subtitle1" marginBottom="1em">
            Enter Coins/Bills Quantity:
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(coinQuantities).map(([denomination, quantity]) => (
              <Grid item xs={6} sm={4} md={3} key={denomination}>
                <TextField
                  color="secondary"
                  label={`${denomination} Peso(s)`}
                  type="number"
                  value={quantity}
                  onChange={(e) => handleInputChange(denomination, e)}
                />
              </Grid>
            ))}
          </Grid>
          <Box mb={2} marginTop="2em">
            <TextField
              color="secondary"
              label="Total Starting Cash"
              type="number"
              value={calculateTotal().toFixed(2)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ background: theme.palette.primary[700] }}>
          <Button onClick={handleClearCash} color="error" variant="outlined">
            Reset
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

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this record?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} sx={{ color: "#000" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} sx={{ color: "#26B02B" }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SalesManagement;
