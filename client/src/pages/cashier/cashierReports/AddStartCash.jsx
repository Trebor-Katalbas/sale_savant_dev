import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { baseUrl } from "state/api";
import { useSelector } from "react-redux";

const denominations = {
  "5 cents": 0.05,
  "10 cents": 0.1,
  "25 cents": 0.25,
  "50 cents": 0.5,
  "1 peso": 1,
  "5 peso": 5,
  "10 peso": 10,
  "20 peso": 20,
  "50 peso": 50,
  "100 peso": 100,
  "200 peso": 200,
  "500 peso": 500,
  "1000 peso": 1000,
};

const StartCashModal = ({ open, handleClose }) => {
  const user = useSelector((state) => state.global.user);

  const validationSchema = Yup.object().shape({
    startCash: Yup.number().min(0).required(),
  });

  const [amounts, setAmounts] = useState({
    "5 cents": "",
    "10 cents": "",
    "25 cents": "",
    "50 cents": "",
    "1 peso": "",
    "5 peso": "",
    "10 peso": "",
    "20 peso": "",
    "50 peso": "",
    "100 peso": "",
    "200 peso": "",
    "500 peso": "",
    "1000 peso": "",
  });

  const handleChanges = (event, field) => {
    const { value } = event.target;
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [field]: value,
    }));
  };

  const getTotalAmount = () => {
    let total = 0;
    Object.entries(amounts).forEach(([denomination, count]) => {
      const amount = parseFloat(count) * denominations[denomination];
      total += isNaN(amount) ? 0 : amount;
    });
    return total.toFixed(2);
  };

  const initialValues = {
    startCash: getTotalAmount(),
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${baseUrl}sales-management/add-startcash`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: user.userName,
          startCash: getTotalAmount(),
        }),
      });

      if (response.ok) {
        console.log("Start Cash Added");
        handleClose();
      } else {
        console.error("Failed to add start cash:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding start cash:", error.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ background: "#BFF9FF" }}>Enter Amount</DialogTitle>
      <DialogContent sx={{ background: "#BFF9FF" }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {Object.entries(amounts)
              .filter(([label]) => label.includes("peso"))
              .map(([label, value]) => (
                <TextField
                  key={label}
                  label={label}
                  value={value}
                  onChange={(e) => handleChanges(e, label)}
                  fullWidth
                  type="number"
                  color="secondary"
                  style={{ marginBottom: "1em" }}
                />
              ))}
          </Grid>
          <Grid item xs={6}>
            {Object.entries(amounts)
              .filter(([label]) => label.includes("cents"))
              .map(([label, value]) => (
                <TextField
                  key={label}
                  label={label}
                  value={value}
                  onChange={(e) => handleChanges(e, label)}
                  fullWidth
                  type="number"
                  color="secondary"
                  style={{ marginBottom: "1em" }}
                />
              ))}
          </Grid>
        </Grid>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleBlur, handleChange }) => (
            <Form>
              <Field
                name="startCash"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Total Amount"
                fullWidth
                as={TextField}
                type="number"
                color="secondary"
                InputProps={{ readOnly: true }}
                value={getTotalAmount()}
              ></Field>

              <DialogActions sx={{ background: "#BFF9FF" }}>
                <Button onClick={handleClose} variant="outlined" color="error">
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

export default StartCashModal;
