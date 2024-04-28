import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Header } from "components";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";

const AddAccountSchema = Yup.object().shape({
  userName: Yup.string().required("Required"),
  role: Yup.string().required("Required"),
  userNumber: Yup.number().required("Required"),
  password: Yup.string().required("Required"),
  confirmPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const AddAccount = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const initialValues = {
    userName: "",
    role: "",
    userNumber: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`${baseUrl}auth/createAccount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Account added successfully!");
        setSuccessModalOpen(true);
        setTimeout(() => {
          setSuccessModalOpen(false);
          navigate("/account management");
        }, 1500);
      } else {
        console.error("Failed to add account:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

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
            Create Account
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

                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Field
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      as={TextField}
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      sx={{
                        background: theme.palette.primary[700],
                        marginBottom: "1em",
                      }}
                      error={
                        Boolean(touched.password) && Boolean(errors.password)
                      }
                      helperText={touched.password && errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <InputLabel htmlFor="confirmPassword">
                      Confirm Password
                    </InputLabel>
                    <Field
                      name="confirmPassword"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.confirmPassword}
                      as={TextField}
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      sx={{
                        background: theme.palette.primary[700],
                        marginBottom: "1em",
                      }}
                      error={
                        Boolean(touched.confirmPassword) &&
                        Boolean(errors.confirmPassword)
                      }
                      helperText={
                        touched.confirmPassword && errors.confirmPassword
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
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
                          Create
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
            color:'green',
            border:'solid 1px green',
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

export default AddAccount;
