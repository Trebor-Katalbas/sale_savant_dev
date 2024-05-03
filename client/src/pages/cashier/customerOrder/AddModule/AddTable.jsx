import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { baseUrl } from "state/api";

const initialValues = {
  tableNo: "",
  pax: 0,
  status: "Vacant",
};

const AddTableDialog = ({ open, handleClose, handleSubmit }) => {
  const [tables, setTables] = useState([]);

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
    fetchTableData();
  }, []);

  const validationSchema = Yup.object().shape({
    tableNo: Yup.string()
      .test("is-unique", "Table Number already exists", async function (value) {
        const existingTable = tables.find((table) => table.tableNo === value);
        return !existingTable;
      })
      .required("Table Number is required"),
    pax: Yup.number()
      .min(2, "Pax must be at least 2")
      .max(10, "Maximum pax: 10")
      .required("Pax is required"),
  });
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Table</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1em",
                margin: "1em 0",
              }}
            >
              <Field
                name="tableNo"
                as={TextField}
                label="Table Number"
                error={errors.tableNo && touched.tableNo}
                helperText={errors.tableNo}
                fullWidth
              />
              <Field
                name="pax"
                type="number"
                as={TextField}
                label="Pax"
                error={errors.pax && touched.pax}
                helperText={errors.pax}
                fullWidth
              />
              <Field
                name="status"
                type="text"
                as={TextField}
                label="Status"
                fullWidth
                disabled
              />
              <DialogActions>
                <Button variant="outlined" color="error" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="success">
                  Add
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddTableDialog;
