import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DescriptionIcon from "@mui/icons-material/Description";
import { FlexBetween, Header, LineSalesChart, StatBox } from "components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";
import * as XLSX from "xlsx";

const SalesManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [totalSale, setTotalSale] = useState([]);
  const [currentStartCash, setCurrentStartCash] = useState([]);
  const [eod, setEOD] = useState([]);
  const [eodByMonth, setEODByMonth] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleClickLink = (link) => navigate(link);

  const handleExportToExcel = () => {
    const exportData = eod.map((record) => ({
      Date: new Date(record.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      "Cashier Name": record.cashierName,
      "Starting Cash": record.startCash,
      "Gross Sales": record.grossSales,
      "Total Discounts": record.totalDiscounts,
      "Total Refunds": record.refunds,
      "Net Sales": record.netSales,
      "Gross Income": record.grossIncome,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Supply Records");

    XLSX.writeFile(wb, "Sales_Record.xlsx");
  };

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

  const fetchEODByMonth = async (month) => {
    try {
      const response = await fetch(
        `${baseUrl}home/get-eod-by-month?month=${month}`
      );
      if (response.ok) {
        const data = await response.json();
        const eodWithId = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setEODByMonth(eodWithId);
      } else {
        console.error("Failed to fetch eod data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    fetchEODByMonth(currentMonth);
  }, []);

  const fetchCurrentStartingCash = async () => {
    try {
      const response = await fetch(
        `${baseUrl}sales-management/get-current-startcash`
      );
      if (response.ok) {
        const data = await response.json();
        setCurrentStartCash(data);
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  useEffect(() => {
    fetchCurrentStartingCash();
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
      width: 100,
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
    {
      field: "divider",
      headerName: "",
      width: 10,
      sortable: false,
      renderCell: () => (
        <Divider orientation="vertical" sx={{ marginLeft: "2em" }} />
      ),
    },
    { field: "cashierName", headerName: "Cashier Name", width: 210 },
    { field: "startCash", headerName: "Starting Cash", width: 120 },
    {
      field: "divider",
      headerName: "",
      width: 10,
      sortable: false,
      renderCell: () => (
        <Divider orientation="vertical" sx={{ marginLeft: "2em" }} />
      ),
    },
    { field: "grossSales", headerName: "Gross Sales (Php)", width: 120 },
    {
      field: "totalDiscounts",
      headerName: "Total Discounts (Php)",
      width: 180,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography color={theme.palette.secondary[400]}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "refunds",
      headerName: "Refunds (Php)",
      width: 120,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography color={theme.palette.secondary[400]}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "netSales",
      headerName: "Net Sales (Php)",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography color="#007C39">{params.value}</Typography>
      ),
    },
    {
      field: "expenses",
      headerName: "Expenses (Php)",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography color={theme.palette.secondary[400]}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "grossIncome",
      headerName: "Gross Income (Php)",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography color="#007C39">{params.value}</Typography>
      ),
    },
    {
      field: "divider",
      headerName: "",
      width: 20,
      sortable: false,
      renderCell: () => (
        <Divider orientation="vertical" sx={{ marginLeft: "2em" }} />
      ),
    },
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
              data={eodByMonth.map((item) => ({
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
                onClick={() => handleClickLink(`/add eod`)}
              >
                Add EoD
              </Button>
            </Tooltip>
            <Button
              startIcon={<DescriptionIcon color="success" />}
              variant="contained"
              onClick={handleExportToExcel}
            >
              Export to Excel
            </Button>
          </Box>
          <Typography variant="h6">
            Starting Cash(Today):{" "}
            <span
              style={{
                background: theme.palette.secondary[800],
                borderRadius: "5px",
                padding: "0.5em",
              }}
            >
              {currentStartCash.startCash > 0
                ? `Php ${currentStartCash.startCash}`
                : "No Starting Cash Recorded"}
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
