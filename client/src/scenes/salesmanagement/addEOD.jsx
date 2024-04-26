import {
  Box,
  Button,
  Divider,
  InputLabel,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Header } from "components";
import { Field, Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";
import * as Yup from "yup";

const AddEODSchema = Yup.object().shape({
  date: Yup.date().required("Required"),
  cashierName: Yup.string().notRequired(),
  startCash: Yup.number().min(0).notRequired(),
});

const AddEOD = () => {
  const theme = useTheme();
  const [currentStartCash, setCurrentStartCash] = useState([]);
  const [totalStats, setTotalStats] = useState([]);
  const navigate = useNavigate();
  const date = new Date();
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate());

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

  const initialValues = {
    date: nextDay.toISOString().split("T")[0],
    cashierName: currentStartCash.userName,
    startCash: currentStartCash.startCash,
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${baseUrl}home/create-eod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: nextDay.toISOString().split("T")[0],
          cashierName: currentStartCash.userName,
          startCash: currentStartCash.startCash,
        }),
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

  const formattedDate = `${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date
    .getDate()
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

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
        {({ errors, touched, handleBlur, handleChange }) => (
          <Form>
            <Box sx={{ margin: "2em", width: "60%" }}>
              <InputLabel htmlFor="date">Select Date</InputLabel>
              <Field
                fullWidth
                name="date"
                type="date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={nextDay.toISOString().split("T")[0]}
                as={TextField}
                sx={{
                  background: theme.palette.primary[700],
                  marginBottom: "1em",
                }}
                error={Boolean(touched.date) && Boolean(errors.date)}
                helperText={touched.date && errors.date}
              />
              <Box display="none" gap="1.5em">
                <Field
                  color="secondary"
                  name="cashierName"
                  label="Cashier Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={currentStartCash.userName}
                  margin="normal"
                  sx={{ background: theme.palette.primary[700] }}
                ></Field>
              </Box>
              <Box display="none" gap="1.5em">
                <Field
                  color="secondary"
                  name="startCash"
                  label="Starting Cash"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={currentStartCash.startCash}
                  type="number"
                  margin="normal"
                  sx={{ background: theme.palette.primary[700] }}
                ></Field>
              </Box>

              <Box>
                <Typography variant="h4" marginBottom="0.5em" marginTop="1em">
                  Cashier Report(Today)
                </Typography>

                {currentStartCash.startCash > 0 ? (
                  <>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection={{
                        xs: "column",
                        sm: "column",
                        md: "row",
                        lg: "row",
                      }}
                      gap="2em"
                      sx={{
                        background: theme.palette.secondary[700],
                        borderRadius: "5px",
                        padding: "2em",
                      }}
                    >
                      <Box textAlign="center">
                        <Typography variant="h6">Date</Typography>
                        <Divider sx={{ margin: "0.6em 0" }} />
                        <Typography variant="body1">{formattedDate}</Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h6">Name</Typography>
                        <Divider sx={{ margin: "0.6em 0" }} />
                        <Typography variant="body1">
                          {currentStartCash.userName}
                        </Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h6">Start Cash</Typography>
                        <Divider sx={{ margin: "0.6em 0" }} />
                        <Typography variant="body1">
                          Php {currentStartCash.startCash}
                        </Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h6">Total Sales</Typography>
                        <Divider sx={{ margin: "0.6em 0" }} />
                        <Typography variant="body1">
                          Php {totalStats.totalSalesToday}
                        </Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h6">
                          Total Discount Given
                        </Typography>
                        <Divider sx={{ margin: "0.6em 0" }} />
                        <Typography variant="body1">
                          Php {totalStats.totalAmountDiscounted}
                        </Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h6">Total Refund</Typography>
                        <Divider sx={{ margin: "0.6em 0" }} />
                        <Typography variant="body1">
                          Php {totalStats.totalRefundsAmount}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        background: theme.palette.secondary[700],
                        borderRadius: "5px",
                        padding: "2em 0",
                      }}
                    >
                      <Typography>No Reports for Today</Typography>
                    </Box>
                  </>
                )}

                <Typography variant="h4" marginBottom="0.5em" marginTop="1em">
                  Total Expenses(Today)
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    background: theme.palette.secondary[700],
                    borderRadius: "5px",
                    padding: "1em 3em",
                  }}
                >
                  <Typography variant="h3">
                    {totalStats.totalExpenses}
                  </Typography>
                  <Typography variant="h5">Php</Typography>
                </Box>
              </Box>

              <Box mt={2} display="flex" justifyContent="flex-end">
                <Box display="flex" flexDirection="column" gap="1em">
                  <Button
                    disabled={currentStartCash.startCash === 0}
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
