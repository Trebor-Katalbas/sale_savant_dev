import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Header } from "components";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "state/api";

const AddAccountSchema = Yup.object().shape({
  userName: Yup.string().required("Required"),
  role: Yup.string().required("Required"),
  userNumber: Yup.number().required("Required"),
});

const EditAccount = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const { id } = useParams();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}auth/getAccount/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setAccount(data);
        } else {
          console.error("Failed to fetch account data:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
    };

    fetchInventoryData();
  }, [id]);

  const initialValues = account
    ? {
        userName: account.userName,
        role: account.role,
        userNumber: account.userNumber,
      }
    : {
        userName: "",
        role: "",
        userNumber: "",
      };

  if (account === null) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`${baseUrl}auth/updateAccount/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Account updated successfully!");
        setSuccessModalOpen(true);
        setTimeout(() => {
          setSuccessModalOpen(false);
          navigate("/account management");
        }, 1500);
      } else {
        console.error("Failed to update account:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  const handleChangePassword = () =>{
    navigate(`/change password/${id}`)
  }

  return (
    <>
      <Box>
        <Header title={"Account Management"} disp={"none"} />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            background: theme.palette.background.alt,
            width: "100%",
            margin: { xs: "0 2em", md: "0 6em" },
            padding: "3em",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h2" sx={{ color: theme.palette.grey[800] }}>
            Edit Account: {initialValues.userName}
          </Typography>

          <Box>
            <Formik
              initialValues={initialValues}
              validationSchema={AddAccountSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleBlur, handleChange }) => (
                <Form>
                  <Box sx={{ margin: { xs: "2em 1em", md: "2em 10em" } }}>
                    <InputLabel htmlFor="userName">Account Name</InputLabel>
                    <Field
                      name="userName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.userName}
                      as={TextField}
                      fullWidth
                      sx={{
                        background: theme.palette.primary[700],
                        marginBottom: "1em",
                      }}
                      error={
                        Boolean(touched.userName) && Boolean(errors.userName)
                      }
                      helperText={touched.userName && errors.userName}
                    />

                    <InputLabel htmlFor="role">Role</InputLabel>
                    <Field
                      name="role"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.role}
                      as={TextField}
                      fullWidth
                      select
                      sx={{
                        background: theme.palette.primary[700],
                        marginBottom: "1em",
                      }}
                      error={Boolean(touched.role) && Boolean(errors.role)}
                      helperText={touched.role && errors.role}
                    >
                      <MenuItem value="Cashier">Cashier</MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                      <MenuItem value="Kitchen">Kitchen</MenuItem>
                    </Field>

                    <InputLabel htmlFor="userNumber">Unique Number</InputLabel>
                    <Field
                      name="userNumber"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.userNumber}
                      as={TextField}
                      fullWidth
                      sx={{
                        background: theme.palette.primary[700],
                        marginBottom: "1em",
                      }}
                      error={
                        Boolean(touched.userNumber) &&
                        Boolean(errors.userNumber)
                      }
                      helperText={touched.userNumber && errors.userNumber}
                    />
                    <Button variant="contained" sx={{background: theme.palette.secondary[700]}} endIcon={<LockOpenIcon/>} onClick={handleChangePassword}>
                      Change password
                    </Button>

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
                          Save
                        </Button>

                        <Link to="/account management">
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
        </Box>
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
            color:'green'
          }}
        >
          <Typography
            variant="h3"
            display="flex"
            alignItems="center"
            gap="0.5em"
          >
            <TaskAltIcon sx={{ fontSize: "1.5em" }} />
            Successfully Updated
          </Typography>
        </Box>
      )}
    </>
  );
};

export default EditAccount;
