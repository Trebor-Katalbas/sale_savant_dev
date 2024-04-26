import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PaymentsIcon from "@mui/icons-material/Payments";
import ClassIcon from "@mui/icons-material/Class";
import React, { useEffect, useState } from "react";
import { baseUrl } from "state/api";

const TableOrder = ({
  tableNo,
  orderNo,
  orderType,
  totalAmount,
  status,
  selectedId,
  selectedTable,
  onClick,
}) => {
  const theme = useTheme();
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchTableData = async () => {
    try {
      const response = await fetch(`${baseUrl}cashier/get-table`);
      if (response.ok) {
        const data = await response.json();
        setTables(data);
      } else {
        console.error("Failed to fetch table data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  useEffect(() => {
    if (selectedTable) {
      const splitTables = selectedTable.split(",").map((table) => table.trim());
      setSelectedTables(splitTables);
    }
  }, [selectedTable]);

  const handleConfirmTables = async () => {
    try {
      const updatedTables = tables.map((table) => {
        if (selectedTables.includes(table.tableNo)) {
          return { ...table, status: "Vacant" };
        }
        return table;
      });

      const response = await fetch(`${baseUrl}cashier/update-table-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTables),
      });

      if (response.ok) {
        console.log("Table status updated successfully");
        console.log("Selected Tables:", selectedTables);
        handleCloseDialog();
      } else {
        console.error("Failed to update table status:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during table status update:", error);
    }
  };

  const handleDeleteReceipt = async () => {
    try {
      const response = await fetch(
        `${baseUrl}cashier/delete-receipt/${selectedId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Receipt ${selectedId} deleted successfully`);
        fetchTableData();
      } else {
        console.error("Failed to delete receipt:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the delete:", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleClick = () => {
    onClick();
  };

  const handleClearTable = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmClearTable = () => {
    handleDeleteReceipt();
    setDialogOpen(false);
    window.location.reload();
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: status === "Paid" ? "#8AF4BA" : "#F4CFCF",
          border: "1px solid #000",
          borderRadius: "5px",
          padding: "20px",
          textAlign: "center",
          height: "50vh",
          margin: "1em",
          cursor: "pointer",
        }}
      >
        <Button
          variant="outlined"
          color="success"
          onClick={handleClearTable}
          sx={{ position: "absolute", top: 10, right: 10, zIndex: 5, display: status === "Unpaid" ? "none" : "block" }}
        >
          {tableNo === "Take-out" ? "Settle Receipt" : "Clear Table"}
        </Button>
        <Box
          sx={{
            display: "flex",
            flex: "1",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#000",
            zIndex: "2",
          }}
        >
          {tableNo !== "Take-out" && (
            <Typography variant="h4" sx={{ marginBottom: "1em" }}>
              Table
            </Typography>
          )}
          <Typography variant="h1" fontWeight="500">
            {tableNo}
          </Typography>
          {tableNo === "Take-out" && (
            <Typography variant="h2" sx={{ marginTop: "1em" }}>
              Order No. {orderNo}
            </Typography>
          )}
        </Box>

        {tableNo !== "Take-out" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5em",
              zIndex: "2",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #000",
                background: theme.palette.primary[800],
                borderRadius: "5px",
                padding: "10px",
                width: "52%",
                whiteSpace: "nowrap",
              }}
            >
              <Typography variant="h6">Order No.</Typography>
              <Typography variant="body1">{orderNo}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #000",
                background: theme.palette.primary[800],
                borderRadius: "5px",
                padding: "10px",
                width: "46%",
              }}
            >
              <ClassIcon />
              <Typography variant="body1">{orderType}</Typography>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            zIndex: "2",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #000",
              background: theme.palette.primary[800],
              borderRadius: "5px",
              padding: "10px",
              width: "55%",
            }}
          >
            <PaymentsIcon />
            <Typography variant="body1">Php {totalAmount}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #000",
              background: theme.palette.primary[800],
              borderRadius: "5px",
              padding: "10px",
              width: "43%",
            }}
          >
            <PointOfSaleIcon />
            <Typography variant="body1">{status}</Typography>
          </Box>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        {tableNo === "Take-out" ? (
          <>
            <DialogTitle>Settle Receipt Confirmation</DialogTitle>
          </>
        ) : (
          <>
            <DialogTitle>Clear Table Confirmation</DialogTitle>
          </>
        )}
        <DialogContent>
          {tableNo === "Take-out" ? (
            <>
              <Typography>
                Are you sure you want to settle this receipt?{" "}
              </Typography>
            </>
          ) : (
            <>
              <Typography>
                Are you sure you want to clear this table?{" "}
              </Typography>
              <Typography sx={{ color: theme.palette.secondary[500] }}>
                (Clearing this table will also settle the receipt.)
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleConfirmClearTable();
              if (tableNo !== "Take-out") {
                handleConfirmTables();
              }
            }}
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

export default TableOrder;
