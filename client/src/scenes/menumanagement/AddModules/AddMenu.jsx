import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { FlexBetween, Header } from "components";
import { Link, useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";
import { baseUrl } from "state/api";

const AddMenuSchema = Yup.object().shape({
  menuItem: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  price: Yup.number().required("Required"),
  salesTarget: Yup.number().required("Required"),
  picture: Yup.string().required("required"),
  description: Yup.string(),
});

const categories = [
  "Main Dish",
  "Tausug Dish",
  "Dessert",
  "Tausug Dessert",
  "Drinks",
];

const AddMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [category, setCategory] = useState([]);

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
    menuItem: "",
    category: "",
    price: "",
    salesTarget: "0",
    picture: "",
    description: "",
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    try {
      const response = await fetch(`${baseUrl}menumanagement/addmenu`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Menu added successfully!");
        navigate("/menu management");
      } else {
        console.error("Failed to add menu:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  return (
    <>
      <Box>
        <Box>
          <Header title={"Add Menu"} disp={"none"} />
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={AddMenuSchema}
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
              <Box sx={{ margin: "0.5em 2em", width: "60%" }}>
                <InputLabel htmlFor="menuItem">Menu Name</InputLabel>
                <Field
                  name="menuItem"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.menuItem}
                  as={TextField}
                  fullWidth
                  sx={{
                    background: theme.palette.primary[700],
                    marginBottom: "1em",
                  }}
                  error={Boolean(touched.menuItem) && Boolean(errors.menuItem)}
                  helperText={touched.menuItem && errors.menuItem}
                />
                <InputLabel htmlFor="category">Category</InputLabel>
                <Field
                  name="category"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.category}
                  select
                  as={TextField}
                  fullWidth
                  sx={{
                    background: theme.palette.primary[700],
                    marginBottom: "1em",
                  }}
                  error={Boolean(touched.category) && Boolean(errors.category)}
                  helperText={touched.category && errors.category}
                >
                  {category.map((cat) => (
                    <MenuItem key={cat.id} value={cat.categoryName}>
                      {cat.categoryName}
                    </MenuItem>
                  ))}
                </Field>

                <InputLabel htmlFor="price">Menu Price</InputLabel>
                <Field
                  name="price"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.price}
                  as={TextField}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">Php</InputAdornment>
                    ),
                  }}
                  sx={{
                    background: theme.palette.primary[700],
                    marginBottom: "1em",
                  }}
                  error={Boolean(touched.price) && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                />

                <Box
                  gridColumn="span 4"
                  border={`1px solid ${theme.palette.grey[400]}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    accept={{
                      "image/jpg": [],
                      "image/jpeg": [],
                      "image/png": [],
                    }}
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles, rejectedFiles) => {
                      if (rejectedFiles && rejectedFiles.length > 0) {
                        setDialogMessage(
                          "Please upload files with .jpg, .jpeg, or .png formats only."
                        );
                        setOpenDialog(true);
                      } else {
                        setFieldValue("picture", acceptedFiles[0]);
                      }
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${theme.palette.primary[400]}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <img
                              src={URL.createObjectURL(values.picture)}
                              alt="Preview"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100px",
                                marginBottom: "0.5rem",
                              }}
                            />
                            <Typography>{values.picture.name}</Typography>
                            <EditIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>

                <InputLabel htmlFor="description" sx={{ marginTop: "1em" }}>
                  Description
                </InputLabel>
                <Field
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  as={TextField}
                  fullWidth
                  sx={{ background: theme.palette.primary[700] }}
                  error={
                    Boolean(touched.description) && Boolean(errors.description)
                  }
                  helperText={touched.description && errors.description}
                  multiline
                  rows={4}
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

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle color={theme.palette.secondary[400]}>
            File Format Error
          </DialogTitle>
          <DialogContent>{dialogMessage}</DialogContent>
          <Button onClick={() => setOpenDialog(false)} variant="contained">
            OK
          </Button>
        </Dialog>
      </Box>
    </>
  );
};

export default AddMenu;
