import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { SaleSavantLogo } from "assets";
import { FlexBetween, StatBox } from "components";
import { AddStartCash } from "pages";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useSelector } from "react-redux";

const CashierReports = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.global.user);
  const userNameSaved = user.userName;
  const [receipt, setReceipt] = useState([]);
  const [totalStats, setTotalStats] = useState([]);
  const [startingCash, setStartingCash] = useState([]);
  const [currentStartCash, setCurrentStartCash] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    const fetchTotalStat = async () => {
      try {
        const response = await fetch(`${baseUrl}home/get-cashier-reports`);
        if (response.ok) {
          const data = await response.json();
          setTotalStats(data);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
    };

    fetchTotalStat();

    const intervalId = setInterval(() => {
      fetchTotalStat();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchStartingCash = async () => {
    try {
      const response = await fetch(
        `${baseUrl}sales-management/get-startcash-all`
      );
      if (response.ok) {
        const data = await response.json();
        const startingCashWithId = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setStartingCash(startingCashWithId.reverse());
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  useEffect(() => {
    fetchStartingCash();
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

  const handleButtonClick = (link) => {
    navigate(link);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (_id) => {
    setDeleteDialogOpen(true);
    setSelectedItemId(_id);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${baseUrl}sales-management/delete-startcash/${selectedItemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(
          `Record with ID ${selectedItemId} deleted successfully`
        );
        fetchStartingCash();
        window.location.reload();
      } else {
        console.error("Failed to delete record:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the delete:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };

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
    { field: "userName", headerName: "Cashier Name", width: 250 },
    {
      field: "startCash",
      headerName: "Starting Cash",
      width: 140,
      renderCell: (params) => <div>PHP {params.value}</div>,
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        if (params.row.userName !== userNameSaved) {
          return null;
        }
        return (
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
        );
      },
    },
  ];

  return (
    <>
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
                onClick={() => handleButtonClick("/refunds")}
              >
                Refunds
              </Button>
              <Button
                variant="contained"
                sx={{ background: theme.palette.primary[500] }}
              >
                Reports
              </Button>
            </div>
          </FlexBetween>

          <Typography variant="h1" marginBottom="0.5em">
            Reports
          </Typography>
          <Divider sx={{ marginBottom: "1.5em", background: "#7E7E7E" }} />
          <Box
            display="flex"
            gap="2em"
            flexWrap={{
              xs: "wrap",
              sm: "wrap",
              md: "wrap",
              lg: "nowrap",
              xl: "nowrap",
            }}
          >
            <Box width="100%">
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleOpenModal}
                  disabled={currentStartCash.startCash > 0}
                >
                  Add Start Cash
                </Button>
              </Box>

              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  padding="1em 0"
                >
                  <Typography variant="h3"> Today</Typography>
                  <Typography variant="h6">
                    Starting Cash:{" "}
                    <span
                      style={{
                        background: theme.palette.secondary[800],
                        borderRadius: "5px",
                        padding: "0.5em",
                      }}
                    >
                      {currentStartCash.startCash > 0
                        ? `Php ${currentStartCash.startCash}`
                        : "No Record"}
                    </span>
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap="1em">
                  <StatBox
                    title={"Total Sales"}
                    value={`Php ${totalStats.totalSalesToday}`}
                    height="14vh"
                    bg={theme.palette.primary[700]}
                  />
                  <StatBox
                    title={"Total Discount Given"}
                    value={`Php ${totalStats.totalAmountDiscounted}`}
                    height="14vh"
                    bg={theme.palette.primary[700]}
                  />
                  <StatBox
                    title={"Total Refunds"}
                    value={`Php ${totalStats.totalRefundsAmount}`}
                    height="14vh"
                    bg={theme.palette.primary[700]}
                  />
                </Box>
              </Box>
            </Box>
            <Box
              width="100%"
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
                rows={startingCash}
                columns={columns}
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
      </Box>

      <AddStartCash open={isModalOpen} handleClose={handleCloseModal} />

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

export default CashierReports;
