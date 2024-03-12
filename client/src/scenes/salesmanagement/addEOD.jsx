import { Box, Button, InputLabel, TextField, useTheme } from "@mui/material";
import { Header } from "components";
import { Field, Formik, Form } from "formik";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "state/api";
import * as Yup from "yup";

const AddEODSchema = Yup.object().shape({
  date: Yup.date().required("Required"),
  startCash: Yup.number().required("Required"),
});

const AddEOD = () => {
  const cash = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const startCash = cash.id;

  const initialValues = {
    date: new Date().toISOString().split("T")[0],
    startCash: startCash,
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`${baseUrl}home/create-eod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("EOD added successfully!");
        navigate("/sales management");
      } else {
        console.error("Failed to add eod:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  return (
    <Box>
      <Box>
        <Header title={"Add EOD Record"} disp={"none"} />
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={AddEODSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => (
          <Form>
            <Box sx={{ margin: "2em", width: "60%" }}>
              <InputLabel htmlFor="date">Select Date</InputLabel>
              <Field
                fullWidth
                name="date"
                type="date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.date}
                as={TextField}
                sx={{
                  background: theme.palette.primary[700],
                  marginBottom: "1em",
                }}
                error={Boolean(touched.date) && Boolean(errors.date)}
                helperText={touched.date && errors.date}
              />
              <Box display="flex" gap="1.5em">
                <Field
                  disabled
                  color="secondary"
                  name="startCash"
                  label="Starting Cash"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.startCash}
                  as={TextField}
                  type="number"
                  fullWidth
                  margin="normal"
                  sx={{ background: theme.palette.primary[700] }}
                  error={
                    Boolean(touched.startCash) && Boolean(errors.startCash)
                  }
                  helperText={touched.startCash && errors.startCash}
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
                  <Link to="/sales management">
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

export default AddEOD;
