import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputBase,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FlexBetween, Header } from "components";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, { useEffect, useState } from "react";
import { baseUrl } from "state/api";

const OrderSales = () => {
  const theme = useTheme();
  const [orderSales, setOrderSale] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const fetchReceiptData = async () => {
    try {
      const response = await fetch(`${baseUrl}sales-management/get-orderSales`);
      if (response.ok) {
        const data = await response.json();
        const orderSalesWithId = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setOrderSale(orderSalesWithId);
      } else {
        console.error("Failed to fetch order sales data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };
  useEffect(() => {
    fetchReceiptData();
  }, []);

  const handleReset = () => {
    setResetDialogOpen(true);
  };

  const handleCancelReset = () => {
    setResetDialogOpen(false);
  };

  const handleDelete = (_id) => {
    setDeleteDialogOpen(true);
    setSelectedItemId(_id);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleConfirmReset = async () => {
    try {
      const response = await fetch(
        `${baseUrl}sales-management/delete-AllSale`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`All sales deleted successfully`);
        fetchReceiptData();
      } else {
        console.error("Failed to delete order sales:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the delete:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${baseUrl}sales-management/delete-orderSale/${selectedItemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(
          `Order sale with ID ${selectedItemId} deleted successfully`
        );
        fetchReceiptData();
      } else {
        console.error("Failed to delete order sale:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the delete:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };

  const sortedOrderSales = orderSales.slice().sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const today = new Date().toLocaleDateString();
  const yesterday = new Date(Date.now() - 864e5).toLocaleDateString();

  const todayData = sortedOrderSales.filter(
    (item) => new Date(item.createdAt).toLocaleDateString() === today
  );
  const yesterdayData = sortedOrderSales.filter(
    (item) => new Date(item.createdAt).toLocaleDateString() === yesterday
  );

  const shortColumns = [
    {
      field: "createdAt",
      headerName: "Date",
      width: 80,
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
    { field: "orderNo", headerName: "Order No.", width: 80 },
    { field: "paymentType", headerName: "Payment Method", width: 120 },
    { field: "paymentCode", headerName: "Payment Code", width: 100 },
    { field: "orderType", headerName: "Order Type", width: 80 },
    { field: "noItems", headerName: "No. of Items/Dishes", width: 140 },
    { field: "totalAmount", headerName: "Total Amount (Php)", width: 140 },
  ];

  const columns = [
    {
      field: "createdAt",
      headerName: "Date",
      width: 100,
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
    { field: "paymentCode", headerName: "Payment Code", width: 180 },
    { field: "orderType", headerName: "Order Type", width: 140 },
    { field: "noItems", headerName: "No. of Items/Dishes", width: 140 },
    {
      field: "promoUsed",
      headerName: "Promo Used",
      width: 200,
      renderCell: (params) => (
        <div>
          {params.row.promoUsed.map((promo) => promo.promoName).join(", ")}
        </div>
      ),
    },
    { field: "subTotal", headerName: "Sub Total (Php)", width: 140 },
    {
      field: "amountDiscounted",
      headerName: "Amount Discounted (Php)",
      width: 180,
    },
    { field: "totalAmount", headerName: "Total Amount (Php)", width: 140 },
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
      <Header title={"Order Sales"} link={"/sales management"} />

      <Box margin="1em 2em">
        <Toolbar
          width="100%"
          sx={{
            justifyContent: "space-between",
            padding: "0 !important",
            marginBottom: "1em",
            gap: "1em",
          }}
        >
          <Button
            variant="contained"
            color="error"
            size="medium"
            onClick={handleReset}
          >
            Reset Order Sales
          </Button>

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
        </Toolbar>

        <Box display="flex" justifyContent="space-between" gap="1em" width="100%">
          <Box width="100%">
            <Typography variant="h3" marginBottom="0.5em">
              {today}, Today
            </Typography>
            <Box
              height="270px"
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
                columns={shortColumns}
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
          <Box width="100%">
            <Typography variant="h3" marginBottom="0.5em">
              {yesterday}, Yesterday
            </Typography>
            <Box
              height="270px"
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
                rows={yesterdayData}
                columns={shortColumns}
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
        </Box>
        <Divider
          sx={{ background: theme.palette.primary[400], margin: "1em 0" }}
        />

        <Typography variant="h3" marginBottom="0.5em">
          All
        </Typography>
        <Box
          height="50vh"
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
            rows={orderSales}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 7,
                },
              },
            }}
            pageSizeOptions={[7]}
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

      <Dialog open={resetDialogOpen} onClose={handleCancelReset}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to reset all sales?
          <span style={{ color: "#DC3545" }}>
            {" "}
            (This action cannot be undone)
          </span>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReset} sx={{ color: "#000" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmReset} sx={{ color: "#26B02B" }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderSales;
