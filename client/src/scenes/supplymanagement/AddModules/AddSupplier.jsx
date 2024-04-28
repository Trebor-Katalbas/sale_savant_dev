import React, { useState } from "react";
import { Box, Button, InputLabel, TextField, Typography, useTheme } from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Header } from "components";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const AddSupplierSchema = Yup.object().shape({
  supplierName: Yup.string().required("Required"),
  contactPerson: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  contactNo: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email format").required("Required"),
});

const AddSupplier = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const initialValues = {
    supplierName: "",
    contactPerson: "",
    category: "",
    contactNo: "",
    email: "",
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`${baseUrl}supply-management/add-supplier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Supplier added successfully!");
        setSuccessModalOpen(true);
        setTimeout(() => {
          setSuccessModalOpen(false);
          navigate("/supply and purchase management/supplier-management");
        }, 1500);
      } else {
        console.error("Failed to add supplier:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  return (
    <>
      <Box>
        <Box>
          <Header title={"Add Supplier"} disp={"none"} />
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={AddSupplierSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleBlur, handleChange }) => (
            <Form>
              <Box sx={{ margin: "2em", width: "60%" }}>
                <InputLabel htmlFor="supplierName">Supplier Name</InputLabel>
                <Field
                  name="supplierName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.supplierName}
                  placeholder="Enter Supplier/Company Name"
                  as={TextField}
                  fullWidth
                  sx={{
                    background: theme.palette.primary[700],
                    marginBottom: "1em",
                  }}
                  error={
                    Boolean(touched.supplierName) &&
                    Boolean(errors.supplierName)
                  }
                  helperText={touched.supplierName && errors.supplierName}
                />
                <InputLabel htmlFor="contactPerson">
                  Contact Person Name
                </InputLabel>
                <Field
                  name="contactPerson"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.contactPerson}
                  placeholder="e.g. Dela Cruz, Juan"
                  as={TextField}
                  fullWidth
                  sx={{
                    background: theme.palette.primary[700],
                    marginBottom: "1em",
                  }}
                  error={
                    Boolean(touched.contactPerson) &&
                    Boolean(errors.contactPerson)
                  }
                  helperText={touched.contactPerson && errors.contactPerson}
                />
                <InputLabel htmlFor="category">Products/Services</InputLabel>
                <Field
                  name="category"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.category}
                  placeholder="e.g. Poultries, Meat, Beverages"
                  as={TextField}
                  fullWidth
                  sx={{
                    background: theme.palette.primary[700],
                    marginBottom: "1em",
                  }}
                  error={Boolean(touched.category) && Boolean(errors.category)}
                  helperText={touched.category && errors.category}
                />
                <Box display="flex" gap="1.5em">
                  <Field
                    color="secondary"
                    name="contactNo"
                    label="Contact No."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.contactNo}
                    as={TextField}
                    fullWidth
                    margin="normal"
                    sx={{ background: theme.palette.primary[700] }}
                    error={
                      Boolean(touched.contactNo) && Boolean(errors.contactNo)
                    }
                    helperText={touched.contactNo && errors.contactNo}
                  />
                  <Field
                    color="secondary"
                    name="email"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    as={TextField}
                    fullWidth
                    margin="normal"
                    sx={{ background: theme.palette.primary[700] }}
                    error={Boolean(touched.email) && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Box>

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
                    <Link to="/supply and purchase management/supplier-management">
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
      </Box>

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

export default AddSupplier;
