import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  useTheme,
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Header } from "components";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";

const AddSupplyDeliverSchema = Yup.object().shape({
  deliverDate: Yup.date().required("Required"),
  supplierName: Yup.string().required("Required"),
  itemName: Yup.string().required("Required"),
  quantity: Yup.number().required("Required"),
  quantityUnit: Yup.string().required("Required"),
  deliveryStatus: Yup.string().required("Required"),
  totalPaid: Yup.number().required("Required"),
  totalCost: Yup.number().required("Required"),
});

const unitOptions = ["pcs", "boxes", "trays", "kg", "g", "L", "mL"];

const AddSupplyRecord = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [supplier, setSupplier] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialValues = {
    deliverDate: new Date(),
    supplierName: "",
    itemName: "",
    quantity: 0,
    quantityUnit: "",
    deliveryStatus: "",
    totalPaid: 0,
    totalCost: 0,
  };

  useEffect(() => {
    fetchSupplier();
  }, []);

  const fetchSupplier = async () => {
    try {
      const response = await fetch(`${baseUrl}supply-management/get-supplier`);
      if (response.ok) {
        const data = await response.json();
        setSupplier(data);
      } else {
        console.error("Failed to fetch supplier:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(
        `${baseUrl}supply-management/add-supplyDelivery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        console.log("Supply Record added successfully!");
        navigate("/supply and purchase management/supply-records");
      } else {
        console.error("Failed to add supplier:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  return (
    <Box>
      <Box>
        <Header title={"Add Supply Record"} disp={"none"} />
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={AddSupplyDeliverSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => (
          <Form>
            <Box sx={{ margin: "2em", width: "60%" }}>
              <InputLabel htmlFor="deliveryDate">Delivery Date</InputLabel>
              <Field
                name="deliveryDate"
                type="date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.deliveryDate}
                as={TextField}
                sx={{
                  background: theme.palette.primary[700],
                  marginBottom: "1em",
                }}
                error={
                  Boolean(touched.deliveryDate) && Boolean(errors.deliveryDate)
                }
                helperText={touched.deliveryDate && errors.deliveryDate}
              />
              <InputLabel htmlFor="supplierName">Supplier</InputLabel>
              <Field
                name="supplierName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.supplierName}
                as={TextField}
                select
                fullWidth
                sx={{
                  background: theme.palette.primary[700],
                  marginBottom: "1em",
                }}
                error={
                  Boolean(touched.supplierName) && Boolean(errors.supplierName)
                }
                helperText={touched.supplierName && errors.supplierName}
              >
                {loading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (
                  supplier.map((supplier, index) => (
                    <MenuItem key={index} value={supplier.supplierName}>
                      {supplier.supplierName} {`(${supplier.category})`}
                    </MenuItem>
                  ))
                )}
              </Field>
              <Box display="flex" gap="1.5em">
                <Field
                  color="secondary"
                  name="itemName"
                  label="Item Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.itemName}
                  as={TextField}
                  fullWidth
                  margin="normal"
                  sx={{ background: theme.palette.primary[700] }}
                  error={Boolean(touched.itemName) && Boolean(errors.itemName)}
                  helperText={touched.itemName && errors.itemName}
                />
                <Box display="flex" gap="1.5em">
                  <Field
                    color="secondary"
                    name="quantity"
                    label="Quantity"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.quantity}
                    as={TextField}
                    type="number"
                    fullWidth
                    margin="normal"
                    sx={{ background: theme.palette.primary[700] }}
                    error={
                      Boolean(touched.quantity) && Boolean(errors.quantity)
                    }
                    helperText={touched.quantity && errors.quantity}
                  />
                  <Field
                    color="secondary"
                    name="quantityUnit"
                    label="Unit"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.quantityUnit}
                    as={TextField}
                    select
                    fullWidth
                    margin="normal"
                    sx={{ background: theme.palette.primary[700] }}
                  >
                    {unitOptions.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Field>
                </Box>
              </Box>
              <Box sx={{ margin: "2em", width: "60%" }}>
                <InputLabel htmlFor="deliveryStatus">
                  Delivery Status
                </InputLabel>
                <RadioGroup
                  aria-label="deliveryStatus"
                  name="deliveryStatus"
                  value={values.deliveryStatus}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Not Delivered"
                    control={<Radio color="secondary" />}
                    label="Not Delivered"
                  />
                  <FormControlLabel
                    value="Partial Delivery"
                    control={<Radio color="secondary" />}
                    label="Partial Delivery"
                  />
                  <FormControlLabel
                    value="Full Delivery"
                    control={<Radio color="secondary" />}
                    label="Full Delivery"
                  />
                </RadioGroup>
              </Box>
              <Box display="flex" gap="1.5em">
                <Field
                  color="secondary"
                  name="totalPaid"
                  label="Total Paid"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.totalPaid}
                  as={TextField}
                  type="number"
                  fullWidth
                  margin="normal"
                  sx={{ background: theme.palette.primary[700] }}
                  error={
                    Boolean(touched.totalPaid) && Boolean(errors.totalPaid)
                  }
                  helperText={touched.totalPaid && errors.totalPaid}
                />
                <Field
                  color="secondary"
                  name="totalCost"
                  label="Total Cost"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.totalCost}
                  as={TextField}
                  type="number"
                  fullWidth
                  margin="normal"
                  sx={{ background: theme.palette.primary[700] }}
                  error={
                    Boolean(touched.totalCost) && Boolean(errors.totalCost)
                  }
                  helperText={touched.totalCost && errors.totalCost}
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
                  <Link to="/supply and purchase management/supply-records">
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
  );
};

export default AddSupplyRecord;
