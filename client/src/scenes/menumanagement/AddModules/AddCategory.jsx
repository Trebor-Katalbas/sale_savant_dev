import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputLabel,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Header } from "components";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";
import { DataGrid } from "@mui/x-data-grid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const CategorySchema = Yup.object().shape({
  categoryName: Yup.string().required("Category Name is required"),
});

const AddPromo = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const theme = useTheme();

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${baseUrl}menumanagement/getCategory`);
      if (response.ok) {
        const data = await response.json();
        const categoryWithId = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setCategory(categoryWithId);
      } else {
        console.error("Failed to fetch category:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const initialValues = {
    categoryName: "",
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`${baseUrl}menumanagement/addCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Category added successfully!");
        setSuccessModalOpen(true);
        setTimeout(() => {
          setSuccessModalOpen(false);
          navigate("/menu management");
        }, 1500);
      } else {
        console.error("Failed to add category:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
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

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${baseUrl}menumanagement/category/${selectedItemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Category with ID ${selectedItemId} deleted successfully`);
        fetchCategory();
      } else {
        console.error("Failed to delete category:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the delete:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };

  const columns = [
    { field: "id", headerName: "Category ID", width: 150 },
    {
      field: "createdAt",
      headerName: "Date Created",
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
    { field: "categoryName", headerName: "Category Name", width: 300 },
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
      width: 80,
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
      <Box width="60%">
        <Box>
          <Header title={"Add Category"} disp={"none"} />
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={CategorySchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            setFieldValue,
          }) => (
            <Form>
              <Box sx={{ margin: "0 2em" }}>
                <InputLabel htmlFor="categoryName">Category Name</InputLabel>
                <Field
                  name="categoryName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.categoryName}
                  as={TextField}
                  fullWidth
                  sx={{
                    background: theme.palette.primary[700],
                    marginBottom: "1em",
                  }}
                  error={
                    Boolean(touched.categoryName) &&
                    Boolean(errors.categoryName)
                  }
                  helperText={touched.categoryName && errors.categoryName}
                />

                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Box display="flex" flexDirection="column" gap="1em">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        width: "120px",
                        background: "#35D03B",
                        color: theme.palette.grey[900],
                      }}
                    >
                      Add
                    </Button>
                    <Link to="/menu management">
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{
                          width: "120px",
                          background: theme.palette.secondary[800],
                        }}
                      >
                        Cancel
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>

        <Divider sx={{ margin: "2em", background: "#000" }} />

        <Box
          m="0 1.5rem"
          height="65vh"
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
            rows={category}
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
          Are you sure you want to delete this category?
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

      {successModalOpen && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "1em",
            borderRadius: "10px",
            color:'green',
            border:'solid 1px green'
          }}
        >
          <Typography
            variant="h3"
            display="flex"
            alignItems="center"
            gap="0.5em"
          >
            <TaskAltIcon sx={{ fontSize: "1.5em" }} />
            Successfully Added
          </Typography>
        </Box>
      )}
    </>
  );
};

export default AddPromo;
