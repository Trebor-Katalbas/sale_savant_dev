import React, { useEffect, useState } from "react";
import { FlexBetween, Header } from "components";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputBase,
  Toolbar,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { Search } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { baseUrl } from "state/api";

const MenuInventory = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [menuInventory, setMenuInventory] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cleanDialogOpen, setCleanDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const fetchMenuInventory = async () => {
    try {
      const response = await fetch(`${baseUrl}menumanagement/menuInventory`);
      if (response.ok) {
        const data = await response.json();
        const menuInventoryWithId = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setMenuInventory(menuInventoryWithId);
      } else {
        console.error("Failed to fetch menu inventory:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  useEffect(() => {
    fetchMenuInventory();
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredRows = searchInput
    ? menuInventory.filter((row) =>
        row.menuItem.toLowerCase().includes(searchInput.toLowerCase())
      )
    : menuInventory;

  const handleOpenCleanDialog = () => {
    setCleanDialogOpen(true);
  };

  const handleCloseCleanDialog = () => {
    setCleanDialogOpen(false);
  };

  const handleCleanInventory = async () => {
    try {
      const response = await fetch(`${baseUrl}menumanagement/cleanInventory`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Inventory cleaned successfully");
        fetchMenuInventory();
      } else {
        console.error("Failed to clean inventory:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during clean inventory:", error);
    } finally {
      handleCloseCleanDialog();
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${baseUrl}menumanagement/menuInventory/${selectedItemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Menu with ID ${selectedItemId} deleted successfully`);
        fetchMenuInventory();
      } else {
        console.error("Failed to delete menu:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the delete:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };

  const handleDelete = (_id) => {
    setDeleteDialogOpen(true);
    setSelectedItemId(_id);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleEdit = (_id) => {
    setSelectedItemId(_id);
    navigate(`/edit inventory/${_id}`);
  };

  const columns = [
    { field: "menuId", headerName: "Menu ID", width: 80 },
    {
      field: "dateTime",
      headerName: "Date & Time",
      width: 160,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };
        return date.toLocaleDateString("en-US", options);
      },
    },
    { field: "menuItem", headerName: "Menu Item", width: 200 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "price", headerName: "Prices (Php)", type: "number", width: 100 },
    {
      field: "salesTarget",
      headerName: "Sales Target (Stock)",
      type: "number",
      width: 150,
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
    { field: "noSold", headerName: "No. of Sold", type: "number", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <div
          style={{
            backgroundColor:
              params.row.noSold >= params.row.salesTarget
                ? "#B03021" // Sold Out
                : "#26B02B", // Available
            color: "#FFF",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {params.row.noSold >= params.row.salesTarget
            ? "Sold Out"
            : "Available"}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "1em" }}>
          <EditIcon
            onClick={() => handleEdit(params.row._id)}
            sx={{
              color: theme.palette.primary[300],
              cursor: "pointer",
              fontSize: "2.5em",
            }}
          />
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
      <Box>
        <Header title={"Menu Inventory"} link={"/menu management"} />
      </Box>

      <Box width="100%">
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <FlexBetween>
            <Link
              style={{
                textDecoration: "none",
                color: theme.palette.primary[100],
                marginBottom: "1em",
              }}
              to="/add inventory"
            >
              <Container
                sx={{
                  display: "flex",
                  gap: "0.5em",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AddCircleIcon sx={{ color: "#35D03B", fontSize: "3em" }} />
                <Typography sx={{ fontSize: "1.5em" }}>
                  Add Menu Inventory
                </Typography>
              </Container>
            </Link>
          </FlexBetween>

          <FlexBetween>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleOpenCleanDialog}
            >
              Clean Inventory
            </Button>
            <Container>
              <FlexBetween
                backgroundColor={theme.palette.secondary[700]}
                borderRadius="9px"
                gap="3rem"
                minWidth="300px"
                width="100%"
                p="0.5rem 1.5rem"
              >
                <InputBase
                  placeholder="Search Menu Item..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                <Search />
              </FlexBetween>
            </Container>
          </FlexBetween>
        </Toolbar>

        <Box
          m="1.5rem 2.5rem"
          height="67vh"
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
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this inventory?
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

      <Dialog open={cleanDialogOpen} onClose={handleCloseCleanDialog}>
        <DialogTitle color="error">Confirm Clean Inventory</DialogTitle>
        <DialogContent>
          Are you sure you want to clean the inventory?{" "}
          <span style={{ color: "#E11800" }}>
            This action cannot be undone.
          </span>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCleanDialog} sx={{ color: "#000" }}>
            Cancel
          </Button>
          <Button
            onClick={handleCleanInventory}
            variant="contained"
            color="success"
            sx={{ color: "#fff" }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MenuInventory;
