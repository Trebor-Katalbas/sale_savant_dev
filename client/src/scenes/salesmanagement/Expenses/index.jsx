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
  const [supplyRecord, setSupplyRecord] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const fetchSupplyRecord = async () => {
    try {
      const response = await fetch(
        `${baseUrl}supply-management/get-supplyRecord`
      );
      if (response.ok) {
        const data = await response.json();
        const supplyRecordWithId = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setSupplyRecord(supplyRecordWithId);
      } else {
        console.error("Failed to fetch supply record:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  useEffect(() => {
    fetchSupplyRecord();
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
        console.log(`All records deleted successfully`);
        fetchSupplyRecord();
      } else {
        console.error("Failed to delete supply record:", response.statusText);
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
          `Supply record with ID ${selectedItemId} deleted successfully`
        );
        fetchSupplyRecord();
      } else {
        console.error("Failed to delete supply record:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the delete:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };

  const sortedRecords = supplyRecord.slice().sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const today = new Date().toLocaleDateString();
  const yesterday = new Date(Date.now() - 864e5).toLocaleDateString();

  const todayData = sortedRecords.filter(
    (item) => new Date(item.createdAt).toLocaleDateString() === today
  );
  const yesterdayData = sortedRecords.filter(
    (item) => new Date(item.createdAt).toLocaleDateString() === yesterday
  );

  const getStatus = (totalPaid, totalCost) => {
    if (totalPaid === 0) {
      return { text: "- Unpaid -", color: "#B03021", font: "#fff" };
    } else if (totalPaid !== 0 && totalPaid < totalCost) {
      return { text: "Partially Paid", color: "#E8F4B5", font: "#000" };
    } else if (totalPaid === totalCost) {
      return { text: "-- Paid --", color: "#00DB16", font: "#000" };
    } else {
      return { text: "Unknown", color: "#000", font: "#fff" };
    }
  };

  const shortColumns = [
    {
      field: "deliveryDate",
      headerName: "Delivery Date",
      width: 100,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      field: "supplierName",
      headerName: "Supplier Name",
      width: 140,
      valueGetter: (params) => params.row.supplier[0].supplierName,
    },
    {
      field: "divider1",
      headerName: "",
      width: 20,
      sortable: false,
      renderCell: () => (
        <Divider orientation="vertical" sx={{ marginLeft: "2em" }} />
      ),
    },
    { field: "itemName", headerName: "Item Name", width: 140 },
    { field: "quantity", headerName: "Quantity", width: 70 },
    { field: "totalCost", headerName: "Total Cost (Php)", width: 120 },
    { field: "totalPaid", headerName: "Amount Paid (Php)", width: 140 },
  ];

  const columns = [
    {
      field: "deliveryDate",
      headerName: "Delivery Date",
      width: 140,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      field: "supplierName",
      headerName: "Supplier Name",
      width: 200,
      valueGetter: (params) => params.row.supplier[0].supplierName,
    },
    {
      field: "contactPerson",
      headerName: "Contact Person",
      width: 200,
      valueGetter: (params) => params.row.supplier[0].contactPerson,
    },
    {
      field: "contactNo",
      headerName: "Contact #",
      width: 120,
      valueGetter: (params) => params.row.supplier[0].contactNo,
    },
    {
      field: "divider1",
      headerName: "",
      width: 20,
      sortable: false,
      renderCell: () => (
        <Divider orientation="vertical" sx={{ marginLeft: "2em" }} />
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 160,
      valueGetter: (params) => params.row.supplier[0].category,
    },
    { field: "itemName", headerName: "Item Name", width: 160 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "totalCost", headerName: "Total Cost (Php)", width: 120 },
    {
      field: "divider2",
      headerName: "",
      width: 20,
      sortable: false,
      renderCell: () => (
        <Divider orientation="vertical" sx={{ marginLeft: "2em" }} />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      valueGetter: (params) => {
        const totalPaid = params.row.totalPaid;
        const totalCost = params.row.totalCost;
        return getStatus(totalPaid, totalCost);
      },
      renderCell: (params) => {
        const status = params.value;
        return (
          <div
            style={{
              backgroundColor: status.color,
              padding: "0.5em 0.8em",
              borderRadius: "5px",
              color: status.font,
            }}
          >
            {status.text}
          </div>
        );
      },
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
      <Header title={"Expenses"} link={"/sales management"} />

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
            Reset Expenses Records
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

        <Box
          display="flex"
          justifyContent="space-between"
          gap="1em"
          width="100%"
        >
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
            rows={supplyRecord}
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
