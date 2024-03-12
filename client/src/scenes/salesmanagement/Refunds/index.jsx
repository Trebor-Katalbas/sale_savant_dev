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

const RefundSales = () => {
  const theme = useTheme();
  const [refunds, setRefunds] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const fetchRefundData = async () => {
    try {
      const response = await fetch(`${baseUrl}cashier/get-refunds`);
      if (response.ok) {
        const data = await response.json();
        const refundsWithId = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setRefunds(refundsWithId);
      } else {
        console.error("Failed to fetch refund data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };
  useEffect(() => {
    fetchRefundData();
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
        console.log(`All refunds deleted successfully`);
        fetchRefundData();
      } else {
        console.error("Failed to delete refunds:", response.statusText);
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
          `Refund with ID ${selectedItemId} deleted successfully`
        );
        fetchRefundData();
      } else {
        console.error("Failed to delete Refund:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the delete:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };

  const sortedRefunds = refunds.slice().sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const today = new Date().toLocaleDateString();
  const yesterday = new Date(Date.now() - 864e5).toLocaleDateString();

  const todayData = sortedRefunds.filter(
    (item) => new Date(item.createdAt).toLocaleDateString() === today
  );
  const yesterdayData = sortedRefunds.filter(
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
    { field: "paymentCode", headerName: "Payment Code", width: 100 },
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
      { field: "subTotal", headerName: "Sub Total (Php)", width: 120 },
      { field: "totalRefund", headerName: "Amount Refunded (Php)", width: 160 },
  ];

  const columns = [
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
      <Header title={"Refunds"} link={"/sales management"} />

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
            Reset Refund Records
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
            rows={refunds}
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
          Are you sure you want to reset all refunds?
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

export default RefundSales;
