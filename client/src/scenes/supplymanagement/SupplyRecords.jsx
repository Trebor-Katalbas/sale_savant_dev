import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputAdornment,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FlexBetween, Header } from "components";
import DescriptionIcon from "@mui/icons-material/Description";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "state/api";
import * as XLSX from "xlsx";

const SupplyRecords = () => {
  const theme = useTheme();
  const [supplyRecord, setSupplyRecord] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedTotalPaid, setEditedTotalPaid] = useState(0);
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleExportToExcel = () => {
    const exportData = supplyRecord.map((record) => ({
      "Delivery Date": new Date(record.deliveryDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      ),
      "Supplier Name": record.supplier[0].supplierName,
      "Contact Person": record.supplier[0].contactPerson,
      "Contact #": record.supplier[0].contactNo,
      Category: record.supplier[0].category,
      "Item Name": record.itemName,
      Quantity: record.quantity,
      "Total Cost (Php)": record.totalCost,
      Status: getStatusText(record.totalPaid, record.totalCost),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Supply Records");

    XLSX.writeFile(wb, "Supply_Records.xlsx");
  };

  const getStatusText = (totalPaid, totalCost) => {
    if (totalPaid === 0) {
      return "Unpaid";
    } else if (totalPaid !== 0 && totalPaid < totalCost) {
      return "Partially Paid";
    } else if (totalPaid === totalCost) {
      return "Paid";
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredSupplyRecord = supplyRecord.filter((record) =>
    record.supplier.some(
      (supplier) =>
        supplier.supplierName
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        record.itemName.toLowerCase().includes(searchInput.toLowerCase())
    )
  );

  const sortedRows =
    selectedCategory === "All"
      ? filteredSupplyRecord
      : filteredSupplyRecord.filter((record) =>
          record.supplier.some(
            (supplier) => supplier.category === selectedCategory
          )
        );

  useEffect(() => {
    fetchSupplyRecord();
  }, []);

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
        console.log(supplyRecordWithId);

        const uniqueCategories = [
          ...new Set(
            data.flatMap((item) =>
              item.supplier.map((supplier) => supplier.category)
            )
          ),
        ];
        setCategories([...uniqueCategories]);
      } else {
        console.error("Failed to fetch supply record:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  const handleEdit = (_id) => {
    setSelectedItemId(_id);
    setEditedTotalPaid(
      supplyRecord.find((record) => record._id === _id).totalPaid
    );
    setEditDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setSelectedItemId(null);
    setEditedTotalPaid(0);
  };

  const handleDelete = (_id) => {
    setDeleteDialogOpen(true);
    setSelectedItemId(_id);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleConfirmEdit = async () => {
    try {
      const response = await fetch(
        `${baseUrl}supply-management/edit-totalPaid/${selectedItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ totalPaid: editedTotalPaid }),
        }
      );

      if (response.ok) {
        console.log(
          `Total paid for supply record with ID ${selectedItemId} updated successfully`
        );
        fetchSupplyRecord();
      } else {
        console.error("Failed to update total paid:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the update:", error);
    } finally {
      setEditDialogOpen(false);
      setSelectedItemId(null);
      setEditedTotalPaid(0);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${baseUrl}supply-management/delete-supplyRecord/${selectedItemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(
          `Supply Record with ID ${selectedItemId} deleted successfully`
        );
        fetchSupplyRecord();
      } else {
        console.error("Failed to delete suppply record:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the delete:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };

  const getStatus = (totalPaid, totalCost) => {
    if (totalPaid === 0) {
      return { text: "- Unpaid -", color: "#B03021", font: "#fff" };
    } else if (totalPaid !== 0 && totalPaid < totalCost) {
      return { text: "Partially Paid", color: "#E8F4B5", font: "#000" };
    } else if (totalPaid === totalCost) {
      return { text: "-- Paid --", color: "#00DB16", font: "#000" };
    } else {
      return { text: "Unknown", color: "#000", font: "#fff" }; // Handle other cases
    }
  };

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
      width: 100,
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
    { field: "itemName", headerName: "Item Name", width: 140 },
    { field: "quantity", headerName: "Quantity", width: 80 },
    { field: "quantityUnit", headerName: "Unit", width: 80 },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      width: 120,
    },
    { field: "totalCost", headerName: "Total Cost (Php)", width: 100 },
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
          <RequestQuoteIcon
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
        <Header title={"Supply Deliveries Recording"} disp={"none"} />
      </Box>

      <Box display="flex" flexDirection="column" width="100%" padding="1em 3em">
        <FlexBetween
          sx={{
            flexWrap: "wrap",
            padding: "0 !important",
            marginBottom: "2em",
            gap: "1em",
          }}
        >
          <Link
            to="/add supply-record"
            style={{ display: "flex", textDecoration: "none" }}
          >
            <Button variant="contained" color="success">
              Add Record
            </Button>
          </Link>

          <Button
            startIcon={<DescriptionIcon color="success" />}
            variant="contained"
            onClick={handleExportToExcel}
          >
            Export to Excel
          </Button>
        </FlexBetween>
        <Toolbar
          sx={{
            flexWrap: "wrap",
            padding: "0 !important",
            marginBottom: "2em",
          }}
        >
          <FlexBetween
            sx={{
              width: "100%",
              flexDirection: {
                xs: "column",
                sm: "column",
                md: "row",
                lg: "row",
              },
              gap: "1em",
            }}
          >
            <Container sx={{ margin: "0 !important", padding: "0 !important" }}>
              <FlexBetween
                backgroundColor={theme.palette.secondary[700]}
                borderRadius="9px"
                width={{ xs: "80%", sm: "60%", md: "50%", lg: "40%" }}
                p="0.5rem 1.5rem"
              >
                <InputBase
                  sx={{ width: "100%" }}
                  placeholder="Search Supplier Name/Item Name..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                <Search />
              </FlexBetween>
            </Container>

            <FormControl
              color="secondary"
              sx={{
                display: "flex",
                width: {
                  xs: "100%",
                  sm: "100%",
                  md: "auto",
                  lg: "auto",
                  xl: "auto",
                },
              }}
            >
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Category"
                sx={{
                  width: "180px",
                  border: theme.palette.secondary[300],
                  color: theme.palette.primary[200],
                }}
              >
                <MenuItem value="All">All</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FlexBetween>
        </Toolbar>

        <Box
          height="60vh"
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
            rows={sortedRows}
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
          Are you sure you want to delete this supplier?
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

      <Dialog open={editDialogOpen} onClose={handleCancelEdit}>
        <DialogTitle>Change Total Paid</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="totalPaid"
            label="Total Paid"
            type="number"
            fullWidth
            value={editedTotalPaid}
            onChange={(e) => setEditedTotalPaid(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Php</InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} sx={{ color: "#000" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmEdit} sx={{ color: "#26B02B" }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SupplyRecords;
